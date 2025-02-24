import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PageInfoService, PageLink } from '../../../core/page-info.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  @Input() appPageTitleDirection: string = '';
  @Input() appPageTitleBreadcrumb: boolean;
  @Input() appPageTitleDescription: boolean;

  // title$: Observable<string>;
  // description$: Observable<string>;
  // bc$: Observable<Array<PageLink>>;
  title: string;
  description: string;
  _bc: Array<PageLink>;

  constructor(private pageInfo: PageInfoService,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // this.title$ = this.pageInfo.title.asObservable();
    // this.description$ = this.pageInfo.description.asObservable();
    // this.bc$ = this.pageInfo.breadcrumbs.asObservable();

    const desSub = this.pageInfo.description.subscribe((description) => {
      this.description = description;
      this.ref.detectChanges();
    });
    const titleSub = this.pageInfo.title.subscribe((title) => {
      this.title = title;
      this.ref.detectChanges();
    });
    const bcSub = this.pageInfo.breadcrumbs.subscribe((bc) => {
      this._bc = bc;
      this.ref.detectChanges();
    });
    this.unsubscribe.push(desSub);
    this.unsubscribe.push(titleSub);
    this.unsubscribe.push(bcSub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
