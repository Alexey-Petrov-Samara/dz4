import { useState, useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import useDebounce from '../../hooks/useDebaunts';
import { CatalogPage } from '../../pages/CatalogPages/catalog-page';
import { ProductPage } from '../../pages/ProductPage/product-page';
import { FaqPage } from '../../pages/FAQPage/faq-page';
import { FavoritePage } from '../../pages/FavoritePage/favorite-page';
import { NotFoundPage } from '../../pages/NotFoundPage/not-found-page';
import './index.css';
import Footer from '../Footer/footer';
import Header from '../Header/header';
import Logo from '../Logo/logo';
import Search from '../Search/search';
import SeachInfo from '../SeachInfo';
import Modal from '../Modal/modal';
import { Register } from '../Register/register';
import { Login } from '../Login/login';
import { ResetPassword } from '../ResetPassword/reset-password';
import { HomePage } from '../../pages/HomePage/home-page';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../storage/products/productsSlice';
import { fetchUser, userTokenCheck } from '../../storage/user/userSlice';
import { ProtectedRoute } from '../ProtectedRoute/protected-route';
import localStorage from 'redux-persist/es/storage';
import { CartPage } from '../../pages/CartPage/cart-page';
import { getLocalData } from '../../utils/localStorage';

function App() {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const debounceSearchQuery = useDebounce(searchQuery, 500);
  const dispatch = useDispatch();
  const location = useLocation();
  // const loggedIn = useSelector((state) => state.user.loggedIn);
  const backgroundLocation = location.state?.backgroundLocation;
  const initialPath = location.state?.initialPath;

  const navigate = useNavigate();

  const handleRequest = useCallback(() => {
    setIsLoading(true);
    api
      .search(searchQuery)
      .then((searchResult) => {
        setCards(searchResult);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery]);

  const token = getLocalData('token');

  useEffect(() => {
    const userData = dispatch(userTokenCheck());
    if (token) {
      userData.then(() => {
        dispatch(fetchProducts());
      });
    }
  }, [dispatch, token]);

  useEffect(() => {
    handleRequest();
  }, [debounceSearchQuery]);

  const handleFormSubmit = (inputText) => {
    navigate('/');
    setSearchQuery(inputText);
    handleRequest();
  };

  const handleInputChange = (inputValue) => {
    setSearchQuery(inputValue);
  };

  return (
    <>
      <Header>
        <>
          <Logo className="logo logo_place_header" href="/" />
          <Routes>
            <Route
              path="/catalog"
              element={
                <Search
                  onSubmit={handleFormSubmit}
                  onInput={handleInputChange}
                />
              }
            />
            <Route path="*" element={<></>} />
          </Routes>
        </>
      </Header>
      <main className="content">
        <SeachInfo searchText={searchQuery} />
        <Routes
          location={
            (backgroundLocation && {
              ...backgroundLocation,
              pathname: initialPath,
            }) ||
            location
          }
        >
          <Route index element={<HomePage />} />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={<ProductPage isLoading={isLoading} />}
          />
          <Route path="/faq" element={<FaqPage />} />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path="/register"
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {backgroundLocation && (
          <Routes>
            <Route
              path="/login"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Modal>
                    <Login />
                  </Modal>
                </ProtectedRoute>
              }
            />

            <Route
              path="/register"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Modal>
                    <Register />
                  </Modal>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Modal>
                    <ResetPassword />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
