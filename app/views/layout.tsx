import { ComponentChildren } from "preact";

export const MainLayout = ({ children }: { children: ComponentChildren }) => (
  <html>
    <head>
      <title>Spendy</title>
      <meta name="description" content="Easily track spending" />
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/assets/style.css" />
    </head>
    <body>{children}</body>
  </html>
);
