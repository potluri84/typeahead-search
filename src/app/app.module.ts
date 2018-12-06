
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { NgbdTypeaheadHttp } from './typeahead-http';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_HREF } from '@angular/common';


import { InfiniteScrollModule } from 'ngx-infinite-scroll';



import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {persistCache} from 'apollo-cache-persist';
import { CallbackComponent } from './callback/callback.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service';


const cache = new InMemoryCache();
persistCache(
  {
    cache,
    storage: localStorage
  }
)

if(localStorage['apollo-cache-persist'])
{
  let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
  {
    cache.restore(cacheData);
  }
}

const routes: Routes = [
  { path: 'app', component: AppComponent },
  { path: 'callback', component: CallbackComponent }
];

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ApolloModule,
    HttpLinkModule,
    NgbPaginationModule,
    InfiniteScrollModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )

  ],
  declarations: [AppComponent, NgbdTypeaheadHttp, CallbackComponent],
  bootstrap: [AppComponent],
  providers: [{ provide: APP_BASE_HREF, useValue: 'app' },AuthService]
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
