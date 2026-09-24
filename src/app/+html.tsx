import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" type="image/png" href="/favicon.png?v=32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <style
          dangerouslySetInnerHTML={{
            __html: `@keyframes explore-sheen { 0% { background-position: 130% 50%; } 100% { background-position: -30% 50%; } } .explore-sheen { font-family: SpaceGrotesk_600SemiBold, sans-serif; font-size: 12px; letter-spacing: 2.2px; text-transform: uppercase; color: transparent; background-image: linear-gradient(90deg, #1a1a1a 0%, #1a1a1a 40%, #ffffff 50%, #1a1a1a 60%, #1a1a1a 100%); background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; animation: explore-sheen 2.4s linear infinite; } [data-glass] { -webkit-backdrop-filter: blur(18px) saturate(1.3); backdrop-filter: blur(18px) saturate(1.3); } [data-glass='bar'] { -webkit-backdrop-filter: blur(22px) saturate(1.2); backdrop-filter: blur(22px) saturate(1.2); background-color: rgba(0,0,0,0.72); }`,
          }}
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
