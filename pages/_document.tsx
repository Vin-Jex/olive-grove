import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
        />
      </Head>
      <body className='relative container h-screen w-screen mx-auto flex flex-col items-center justify-center'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
