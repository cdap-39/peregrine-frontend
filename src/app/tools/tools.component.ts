import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../shared/api.service';
import {HttpRequest} from '@angular/common/http';
import {element} from 'protractor';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-upload',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {


  title = 'Peregrine editor';
  public name: string;
  public count = 0;
  public tmpempty = false;
  public popState = false;
  public loading = '';
  public tab = true;
  private message ='';
  public templates = [];
  public step = 1;
  latestRelease: any = {};
  private subscription: Subject<any> = new Subject();

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: '50rem',
    minHeight: '5rem',
    placeholder: 'Type your article.....',
    translate: 'no'
  };

  public htmlContent: any ='';
  public summarizeContent: any;
  public similarContent: any;
  public scanContent: any;

  public summarized: any;
  private scanResults: any[];
  private articleId: string;
  private similarArticles: any[];

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.getArticles();

  }

  public wordCount() {
    this.count = this.htmlContent.split(' ').length;
  }

  public change(num: number) {
    if (this.step === 1 && num !== 1) {
      this.popState = true;
    }
    if(num === 5){
      this.getArticles();
    }
    if(num === 3){
      this.scanResults = [];
    }
    this.step = num;
  }

  public summarize() {
   console.log(this.summarizeContent);
   const oParser = new DOMParser();
    this.loading = 'm-progress';
   const oDOM = oParser.parseFromString(this.summarizeContent, "text/html");
   const text = oDOM.body.innerText;
   this.summarized ='';
     this.apiService.post('https://obscure-citadel-80764.herokuapp.com/api/summarizeArticles',{content:text} )
     .subscribe((data) => {
       console.log(data._body);
       this.summarized = data._body.toString().split('"').join();
       this.loading = '';
       this.popState = true;
     }, (err) => {
       console.log(err);
       this.popState = true;
        this.summarized = 'Sorry ! this article connot be summrized.';
     });

  }

  public serchSimilarArticles() {


     console.log(this.similarContent);
     const oParser = new DOMParser();
     this.loading = 'm-progress';
     const oDOM = oParser.parseFromString(this.similarContent, "text/html");
     const text = oDOM.body.innerText;
     this.similarArticles =[];
     this.apiService.post('http://localhost:5000/similarity',{query:text} )
     .subscribe((data) => {

          console.log(data._body);
          this.similarArticles = JSON.parse(data._body);
          this.loading = '';

          this.popState = true;
     }, (err) => {
          console.log(err);
           this.message = 'Sorry ! We connot find similar articles.';
     });



  }

  public save() {
   if (this.count >= 1 && this.name !== '') {
   this.loading = 'm-progress';
   this.apiService.post('https://obscure-citadel-80764.herokuapp.com/api/save', {'content': this.htmlContent, 'name': this.name})
     .subscribe((data) => {
       console.log(data._body);
       // this.templates = JSON.parse(data._body);
       this.message = 'Your article is safe!';
       this.loading = '';
       this.popState = true;
     }, (err) => {
       console.log(err);
       this.popState = true;
       this.loading = '';
       this.message = 'Sorry article connot save !';
     });
   } else {
        this.popState = true;
        this.loading = '';
        this.message = 'Empty article cannot be saved!';
   }
  }

  public scan() {

    console.log(this.scanContent);
    const oParser = new DOMParser();
    this.loading = 'm-progress';
    this.scanResults = [];
    const oDOM = oParser.parseFromString(this.scanContent, "text/html");
    const text = oDOM.body.innerText;
    this.scanResults = [];
    const violate = [
      {"content":"Vidya", "reason":"Disclosing personal details of victims of rape"},
      {"content":"Pukudi", "reason":"Disclosing personal details of victims"},
    ];
    violate.forEach(element => {
      if( text.indexOf(element.content) >= 0){

        this.scanResults.push(element);

     }
     this.loading = '';
    });


  }

  public getArticles() {

    this.apiService.get('https://obscure-citadel-80764.herokuapp.com/api/getAllsavedArticles')
      .subscribe((data) => {
        console.log(data._body);
        this.templates = JSON.parse(data._body);


      }, (err) => {
        console.log(err);
        setTimeout(() => {
        }, 3000);
      });
  }
  public setDeleteId(id :string){
    this.articleId = id ;
    this.popState = false;
  }

 public deleteArticles() {
    console.log(this.articleId);
    this.popState = true;
    this.loading = 'm-progress';
     this.apiService.delete('https://obscure-citadel-80764.herokuapp.com/api/deleteArticles/' +  this.articleId)
      .subscribe((data) => {
        console.log(data._body);
         this.loading = '';
         this.message = "Your article deleted."
         this.getArticles();
          this.articleId = '';

      }, (err) => {
        console.log(err);
          this.message = "Sorry Your article cannot be delete.!"
          this.loading = '';
           this.articleId = '';
      });

  }


  public  reset() {
    this.message = '';
    this.popState = false;
    this.loading = '';

  }
  public use(content: string) {
    this.htmlContent = content;
    this.step = 1;
  }

}
