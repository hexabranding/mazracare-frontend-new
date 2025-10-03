import { Component, OnInit } from '@angular/core';
import { GalleryService } from '../../admin-panel/pages/gallery/service/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {

  gallleryAll:any = [];

  // galllery = [
  //   {
  //     img: '../assets/images/pintrest/agri2.jpg'
  //   }
  // ]

  constructor( private _gallreyService: GalleryService ) { }

  ngOnInit(): void {
    this.getAllGallery();
  }

  getAllGallery(){
        const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    this._gallreyService.getgallery(defparams).subscribe((res:any)=>{
      console.log(res);
      this.gallleryAll = res.data;
    })

}
}
