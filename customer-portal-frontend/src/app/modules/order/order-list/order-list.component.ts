import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, FreezeService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { getComponent, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { OrderService } from '../order.service';
import { RouterLink } from '@angular/router';
import { PageInfoService } from 'src/app/_metronic/layout';
import { NgbAccordionItem, NgbAccordionModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { QueryBuilderModule, QueryBuilderComponent, RuleModel, TemplateColumn, ColumnsModel } from '@syncfusion/ej2-angular-querybuilder';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { ActivatedRoute } from '@angular/router';
import { DropDownButtonModule, ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { Dialog, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { ToastService } from '../../shared/services/toast.service';
import { finalize, Subscription } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';
import { ResponseStatus } from '../../shared/models/base-response.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    GridModule,
    NgbTooltipModule,
    QueryBuilderModule,
    NgbAccordionModule,
    NgbDropdownModule,
    DropDownButtonModule,
  ],
  providers: [SortService, FilterService, PageService, FreezeService],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private spinner = inject(LoadingService);
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('querybuilder') queryBuilder: QueryBuilderComponent;
  @ViewChild('accordionItem') accordionItem: NgbAccordionItem;

  commands: ItemModel[] = [
    { text: 'Request Cancel', id: 'cancel', iconCss: 'e-icons e-circle-close' },
    { text: 'Request Return', id: 'return', iconCss: 'e-icons e-undo' },
  ];

  subscriptions: Subscription[] = [];
  currency: string = this.authService.currency;
  noteContent: string;
  preFilter: boolean = false;

  initRule: RuleModel = {
    condition: 'and',
    rules: [
      {
        field: 'order_id',
        operator: 'equal',
        type: 'number'
      },
      {
        field: 'order_status',
        operator: 'equal',
        type: 'string'
      },
      {
        field: 'market_order_number',
        operator: 'contains',
        type: 'string'
      },
      {
        field: 'store_name',
        operator: 'contains',
        type: 'string'
      },
      {
        field: 'item_title',
        operator: 'contains',
        type: 'string'
      },
      {
        field: 'note',
        operator: 'contains',
        type: 'string'
      },
      {
        field: 'created_at',
        operator: 'greaterthanorequal',
        type: 'date',
      },
      {
        field: 'market_total_price',
        operator: 'greaterthanorequal',
        type: 'number',
      },
      {
        field: 'supplier_total_price',
        operator: 'greaterthanorequal',
        type: 'number',
      }
    ]
  };
  
  statusTemplate: TemplateColumn = {
    create: () => {
        return createElement('input', { attrs: { 'type': 'text' } });
    },
    destroy: (args: { elementId: string }) => {
        let dropdown: DropDownList = (getComponent(document.getElementById(args.elementId)??'', 'dropdownlist') as DropDownList);
        if (dropdown) {
            dropdown.destroy();
        }
    },
    write: (args: { elements: Element, values: string[] | string, operator: string }) => {
      let ds: {text: string, value: string}[] = [
        {text: 'Pending', value: 'pending'},
        {text: 'Purchased', value: 'purchased'},
        {text: 'Shipped', value: 'shipped'},
        {text: 'Delivered', value: 'delivered'},
        {text: 'Cancelled', value: 'cancelled'},
        {text: 'Error', value: 'error'},
        {text: 'Removed', value: 'removed'},
        {text: 'Refunded', value: 'refunded'}
      ];
        let dropDownObj: DropDownList = new DropDownList({
                dataSource: ds,
                fields: { text: 'text', value: 'value' },
                value: args.values as string,
                placeholder: 'Select Status',
                change: (e: any) => {
                    this.queryBuilder.notifyChange(e.itemData.value, e.element);
                }
            });
            dropDownObj.appendTo('#' + args.elements.id);
    }
  };
  
  filterColumns: ColumnsModel[] = [
    {
      field: 'order_status',
      label: 'Status',
      type: 'string',
      template: this.statusTemplate,
      operators: [{ key: 'Equal', value: 'equal' }],
    },
    {
      field: 'order_id',
      label: 'Order ID',
      type: 'number',
    },
    {
      field: 'market_order_number',
      label: 'Ref. No.',
      type: 'string',
    },
    {
      field: 'store_name',
      label: 'Store',
      type: 'string',
    },
    {
      field: 'item_title',
      label: 'Item',
      type: 'string',
    },
    {
      field: 'note',
      label: 'Note',
      type: 'string',
    },
    {
      field: 'created_at',
      label: 'Created Date',
      type: 'date',
    },
    {
      field: 'market_total_price',
      label: 'Market Price',
      type: 'number',
    },
    {
      field: 'supplier_total_price',
      label: 'Supplier Price',
      type: 'number',
    },
  ];
  
  public query: Query;
  data = new DataManager({
    url: `${environment.backendUrl}/odata/ordersodata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });

  ngOnInit(): void {
    this.page.updateTitle('Orders');
  }

  ngAfterViewInit(): void {
    const temp = JSON.stringify(this.initRule);
    const tempRule: RuleModel = JSON.parse(temp);

    this.route.queryParams.subscribe((params) => {
      if (params['status']) {
        this.preFilter = true;
        this.accordionItem.expand(); // expand so user can see the list is being filtered
        tempRule.rules![1].value = params['status'];
      }
      if(params['from'] && params['to']) {
        this.preFilter = true;
        this.accordionItem.expand(); // expand so user can see the list is being filtered
        tempRule.rules![6].operator = 'between';
        tempRule.rules![6].value = [params['from'], params['to']];
      }
    });

    // if accordion is expanded then QueryBuilder will be created on UI and apply filter on its created event
    if(!this.accordionItem.collapsed) {
      this.queryBuilder.rule = tempRule;
    }
  }

  showNote(note: string) {
    this.noteContent = note;
  }

  onGridCreated() {
    // if preFilter is true, the filtering will be executed in QueryBuilder created event
    if(this.preFilter) {
      return;
    }

    this.query = new Query(); // clear filter
    this.grid.dataSource = this.data;
    this.grid.refresh(); // reload grid
  }

  applyFilter(): void {
    const rules: RuleModel = this.queryBuilder.getRules();
    rules.rules = rules.rules?.filter((r: RuleModel) => r.value);
    const predicate = this.queryBuilder.getPredicate(rules);

    if (predicate) {
      this.query = new Query().where(predicate);
    } else {
      this.query = new Query(); // clear filter
    }
    this.grid.dataSource = this.data;
    // this.grid.refresh(); // reload grid
  }

  clearFilter(): void {
    this.queryBuilder.setRules(this.initRule);
    this.applyFilter();
  }

  rowMenuSelect(args: MenuEventArgs, data: any) {
    switch (args.item.id) {
      case 'cancel':
        this.confirmCancelRequest(data.order_id);
        break;
      case 'return':
        this.confirmReturnRequest(data.order_id);
        break;
    }
  }

  private confirmCancelDialog: Dialog;
  confirmCancelRequest(orderId: number) {
    this.confirmCancelDialog = DialogUtility.confirm({
      title: 'Confirm',
      content: `Are you sure you want to request cancel for order #${orderId}?`,
      okButton: {
        text: 'Confirm',
        click: this.cancelOrder.bind(this, orderId)
      }
    });
  }

  private confirmReturnDialog: Dialog;
  confirmReturnRequest(orderId: number) {
    this.confirmReturnDialog = DialogUtility.confirm({
      title: 'Confirm',
      content: `Are you sure you want to request return for order #${orderId}?`,
      okButton: {
        text: 'Confirm',
        click: this.returnOrder.bind(this, orderId)
      }
    });
  }

  cancelOrder(orderId: number) {
    this.confirmCancelDialog.hide();
    this.spinner.showLoading();
    const sub = this.orderService.requestCancelOrder(orderId)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe((res) => {
      if(res.Status !== ResponseStatus.Success) {
        this.toastService.showError(res.Message);
        return;
      }
      this.toastService.showSuccess('Requested successfully');
      this.grid.refresh();
    });
    this.subscriptions.push(sub);
  }

  returnOrder(orderId: number) {
    this.confirmReturnDialog.hide();
    this.spinner.showLoading();
    const sub = this.orderService.requestReturnOrder(orderId)
    .pipe(
      finalize(() => this.spinner.hideLoading())
    )
    .subscribe((res) => {
      if(res.Status !== ResponseStatus.Success) {
        this.toastService.showError(res.Message);
        return;
      }
      this.toastService.showSuccess('Requested successfully');
      this.grid.refresh();
    });
    this.subscriptions.push(sub);
    }
}
