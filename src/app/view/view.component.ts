import { Component, OnInit } from '@angular/core';
import {ApiService} from '../shared/api.service';
import {element} from 'protractor';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  private step: number;
  private load: boolean;
  private gArticle: string;

  constructor(private apiService: ApiService) { }
  public allArticles: any;
  public catArticles: any[] = [];
  public Error: string;
  public category: string;
  ngOnInit() {
     this.setCategory('talk.home');
     this.step = 1;
     // this.load = false;
  }

  setCategory(cat: string) {
    this.catArticles = [];
    this.load = true;
    this.apiService.get('https://obscure-citadel-80764.herokuapp.com/api/articles')
    .subscribe((data) => {
          this.load = false;
         console.log(data._body);
         // this.category = data._body[0].category;
         this.allArticles = JSON.parse(data._body);
         this.catArticles = [];
         if (cat === 'talk.home') {
           this.catArticles = this.allArticles;
         } else {
           this.allArticles.forEach((dataArticle) => {
             console.log(dataArticle);
             console.log(dataArticle.category.category);

             if (cat === dataArticle.category.category) {
               this.catArticles.push(dataArticle);
             }

           });
         }
      }, (err) => {
         console.log(err);
          this.Error = 'Server Error ! try again later.';
          setTimeout(() => {
           this.Error = '';
        }, 3000);
      });
  }
  // setCategory(cat: string) {
  //   this.getArticle();
  //   this.category = cat;
  //   this.catArticles = [];
  //   this.allArticles.forEach((dataArticle) => {
  //     console.log(dataArticle);
  //     console.log(dataArticle.category.category);
  //     if (cat === dataArticle.category.category) {
  //       this.catArticles.push(dataArticle);
  //     }
  //
  //   });
  // }
  change(num: number) {
    this.step = num;
  }
 setArticle(text:string){
    this.gArticle = text;
 }
}
