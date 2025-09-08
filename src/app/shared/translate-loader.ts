import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

// ✅ No arguments except HttpClient
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(); // Defaults to: /assets/i18n/{lang}.json
}
