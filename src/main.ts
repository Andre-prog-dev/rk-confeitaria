import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// ✅ Firebase Imports CORRETOS
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, browserLocalPersistence, setPersistence } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// ✅ Config Firebase
import firebaseConfig from './firebase.config';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // ✅ Firebase App
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    // ✅ Firebase Auth com persistência
    provideAuth(() => {
      const auth = getAuth();
      setPersistence(auth, browserLocalPersistence);
      return auth;
    }),

    // ✅ Firestore
    provideFirestore(() => getFirestore()),
  ],
});
