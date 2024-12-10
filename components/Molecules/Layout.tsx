import React, { ReactNode } from 'react';
import Meta from '../Atoms/Meta';
import Header from './Header';
import Footer from './Footer';
import CustomCursor from './CustomCursor';

interface LayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <div className='relative'>
      {/*<customcursor />*/}

      <Meta title={title} description={description} />
      <header className='sticky top-0 w-full z-50'>
        <Header />
      </header>
      <main className='relative'>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
