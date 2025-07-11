import { Component, inject, ViewChild } from '@angular/core';
import { FilterService, FreezeService, GridComponent, GridModule, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { getComponent, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth';
import { OrderService } from '../order.service';
import { RouterLink } from '@angular/router';
import { PageInfoService } from 'src/app/_metronic/layout';
import { CurrencyPipe } from '@angular/common';
import { NgbAccordionModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { QueryBuilderModule, QueryBuilderComponent, RuleModel, TemplateColumn, ColumnsModel } from '@syncfusion/ej2-angular-querybuilder';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    GridModule,
    RouterLink,
    CurrencyPipe,
    NgbTooltipModule,
    QueryBuilderModule,
    NgbAccordionModule
  ],
  providers: [SortService, FilterService, PageService, FreezeService],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  private page = inject(PageInfoService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('querybuilder') queryBuilder: QueryBuilderComponent;

  currency: string = this.authService.currency;
  noteContent: string;
  
  public query: Query;
  data = new DataManager({
    url: `${environment.backendUrl}/odata/ordersodata`,
    adaptor: new ODataV4Adaptor(),
    crossDomain: true,
    headers: [{ Authorization: 'Bearer ' + this.authService.getAuthFromLocalStorage()?.AccessToken }]
  });
  initRule: RuleModel = {
    rules: [
      {
        field: 'order_id',
        operator: 'equal',
        value: undefined
      },
      {
        field: 'order_status',
        operator: 'equal',
        value: ''
      },
      {
        field: 'market_order_number',
        operator: 'contains',
        value: ''
      },
      {
        field: 'store_name',
        operator: 'contains',
        value: ''
      },
      {
        field: 'item_title',
        operator: 'contains',
        value: ''
      },
      {
        field: 'note',
        operator: 'contains',
        value: ''
      },
      {
        field: 'created_at',
        operator: 'greaterthanorequal',
        value: undefined
      }
    ]
  };

  ngOnInit(): void {
    this.page.updateTitle('Orders');
    
  }

  statusTemplate: TemplateColumn = {
    create: () => {
        return createElement('input', { attrs: { 'type': 'text' } });
    },
    destroy: (args: { elementId: string }) => {
      console.log(args.elementId);
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
      value: ''
    },
    {
      field: 'order_id',
      label: 'Order ID',
      type: 'number',
      operators: [{ key: 'Equal', value: 'equal' }],
      value: ''
    },
    {
      field: 'market_order_number',
      label: 'Ref. No.',
      type: 'string',
      value: ''
    },
    {
      field: 'store_name',
      label: 'Store',
      type: 'string',
      value: ''
    },
    {
      field: 'item_title',
      label: 'Item',
      type: 'string',
      value: ''
    },
    {
      field: 'note',
      label: 'Note',
      type: 'string',
      value: ''
    },
    {
      field: 'created_at',
      label: 'Created Date',
      type: 'date',
      value: undefined
    }
  ];

  showNote(note: string) {
    this.noteContent = note;
  }

  applyFilter(): void {
    const rules = this.queryBuilder.getRules();
    rules.rules = rules.rules?.filter(r => r.value); // remove rules with empty value
    const predicate = this.queryBuilder.getPredicate(rules);

    if (predicate) {
      this.query = new Query().where(predicate);
    } else {
      this.query = new Query(); // clear filter
    }

    this.grid.query = this.query;
    this.grid.refresh(); // reload grid
  }

  clearFilter(): void {
    this.queryBuilder.rule = this.initRule;
    this.applyFilter();
  }
}
