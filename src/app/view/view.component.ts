import { Component, OnInit } from '@angular/core';
import {ApiService} from '../shared/api.service';
import {element} from 'protractor';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  private step: number;
  private search: string;
  private load: boolean;
  private gArticle: string;
  private vArticle: any = {};
  private key = 'none';
  private fuzzy: any;

  constructor(private apiService: ApiService, private _sanitizer: DomSanitizer) {
    this.fuzzy = require('fuzzy');
  }

  public polCategories = ['All', 'Prasident', 'Prime Minister', 'Parliament', 'Sri Lanka'];
  public sportsCategories = ['All', 'Cricket', 'Foot Ball', 'Olympic'];
  public crimeCategories = ['All', 'Gun', 'CID'];
  public eduCategories = ['All', 'Technology', 'Exams'];

  public allArticles: any;
  public viewArticles: any;
  public catArticles: any[] = [];
  public Error: string;
  public category: string;

  public setUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.setCategory('talk.home');
    this.step = 1;
    // this.load = false;
  }

  setCategory(cat: string) {
    this.catArticles = [];
    this.viewArticles = [];
    this.load = true;
    this.category = cat;
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
        this.viewArticles = this.catArticles.reverse();
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
  public viewArticle(article: any) {
    this.vArticle = article;
  }

  public change(num: number) {
    this.step = num;
  }

  public setArticle(text: string) {
    this.gArticle = text;
  }

  public reset() {
    this.vArticle = {};
    const iframe = document.getElementById('ifameId');
    const iWindow = (<HTMLIFrameElement> iframe).contentWindow;
    iWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    console.log('stop');
  }

  public searchBatch(key: any) {
    console.log(key.value);
    if (key.value === '' || key.value === '') {
      this.viewArticles = this.catArticles;
    } else {
      this.key = key.value;
      this.viewArticles = [];
      this.viewArticles = this.catArticles.filter(word => ('ab ' + word.subject.toString()).toUpperCase().indexOf(this.key.toUpperCase()) > 1);
      // console.log(this.allArticles.filter(word => word.subject.toString().toUpperCase().indexOf(this.key.toUpperCase()) >= 1 ));
      //
      //  const options = {
      //    pre: '<'
      //    , post: '>'
      //    , extract: function (el) {
      //      return el.subject;
      //    }
      //  };
      // let results = this.fuzzy.filter(this.key, this.catArticles, options);
      // let matches = results.map(function(el) { return el.string; });
      // console.log(matches);
    }
  }

  public subSearch(key: string) {

    if (key === 'All') {
      this.viewArticles = this.catArticles;
    } else {
      this.viewArticles = [];
      this.viewArticles = this.catArticles.filter(word => ('ab ' + word.content.toString()).toUpperCase().indexOf(key.toUpperCase()) > 1);
      // console.log(this.allArticles.filter(word => word.subje
    }
  }
}
