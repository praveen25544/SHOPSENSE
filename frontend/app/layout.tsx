'use client';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>ShopSense — AI Shopping</title>
        <meta name="description" content="AI-powered e-commerce with personalised recommendations" />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
