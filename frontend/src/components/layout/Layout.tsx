import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { useHtmlLang } from '../../hooks/useHtmlLang';

export default function Layout() {
  useScrollToTop();
  useHtmlLang();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
