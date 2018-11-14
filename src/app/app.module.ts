
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { NgbdTypeaheadHttp } from './typeahead-http';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';


import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ApolloModule,
    HttpLinkModule,
    NgbPaginationModule,
    InfiniteScrollModule

  ],
  declarations: [AppComponent, NgbdTypeaheadHttp],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create(
      {
        link: httpLink.create({ uri: 'http://localhost:4000/graphql' }),
        cache
      }
    )


  }
}
