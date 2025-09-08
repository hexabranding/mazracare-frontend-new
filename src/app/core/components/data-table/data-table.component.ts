import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [FormsModule , NgIf],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {

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
    console.log(this.tableSettings , this.tableData);

    const tableKeys = Object.keys(this.tableSettings.columns || {});
    if (tableKeys.length > 0) {
      this.tableKeys = tableKeys;
      console.log(this.tableKeys);

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

  deleteItem(data:any){
    this.tableEvent?.emit({
      type: 'delete',
      event: data
    })
  }

  searchItem(){
    this.emitOut();
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
