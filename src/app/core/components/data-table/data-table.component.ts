import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [FormsModule , CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {

  orderStatuses: string[] = ['Pending', 'Processing', 'Preparing' , 'Packed', 'Dispatched' , 'Delivered', 'Cancelled']

  @Input() tableConfig: any;

  @Input() tableSettings: any = {
    columns: {}
  };

  @Input() tableData: any[] = [];

  @Input() totalCount!:number;

  @Output() tableEvent:EventEmitter<any> = new EventEmitter<any>();

  @Input() isLoading:boolean=false;

  pageLimit = 10; // default value
  currentPage = 1;
  totalPages: number[] = [];
  searchTerm:string='';
  tableKeys: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {

    const tableKeys = Object.keys(this.tableSettings.columns || {});
    console.log(tableKeys);

    if (tableKeys.length > 0) {
      this.tableKeys = tableKeys;

    }
    if(this.totalCount){
      this.calculateTotalPages();
    }
  }

  onPageLimitChange(event: any) {
    this.pageLimit = event?.target?.value;
    this.currentPage = 1;
    this.calculateTotalPages();
    this.emitOut();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.emitOut();
  }

  calculateTotalPages() {
    const pages = Math.ceil(this.totalCount / this.pageLimit);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  createClick(){
    this.tableEvent?.emit({
      type: 'add',
      event: {}
    })
  }

  editItem(data:any){
    this.tableEvent?.emit({
      type: 'edit',
      event: data
    })
  }

  viewItem(data:any){
    this.tableEvent?.emit({
      type: 'view',
      event: data
    })
  }

  deleteItem(data:any){
    this.tableEvent?.emit({
      type: 'delete',
      event: data
    })
  }

  searchItem(){
    this.emitOut();
  }



getStatusColor(status: string) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    'pending': 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
    'processing': 'bg-info-subtle text-info-emphasis border border-info-subtle',
    'preparing': 'bg-primary-subtle text-primary-emphasis border border-primary-subtle',
    'packed': 'bg-primary-subtle text-primary-emphasis border border-primary-subtle',
    'Dispatched': 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle',
    'delivered': 'bg-success-subtle text-success-emphasis border border-success-subtle',
    'cancelled': 'bg-danger-subtle text-danger-emphasis border border-danger-subtle',
    // 'returned': 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle'
  };

  return map[s] ?? 'bg-light text-dark border border-light';
}

  onStatusChange(data:any, item:string, newStatus:string){
    data[item] = newStatus;
    this.tableEvent?.emit({
      type: 'statusChange',
      event: {
        data: data,
        field: item,
        newValue: newStatus
      }
    })
  }

  emitOut(){
    this.tableEvent?.emit({
      type: 'apievent',
      event:
      {
        page : this.currentPage,
        limit : this.pageLimit,
        search : this.searchTerm
      }
    })
  }
}
