import { useSelector } from 'react-redux';
import { CartAmount } from '../../components/CartAmount/cart-amount';
import { CartInfo } from '../../components/CartInfo/cart-info';
import { CartList } from '../../components/CartList/cart-list';
import s from './index.module.css';

export const CartPage = () => {
  const productsCart = useSelector((state) => state.cart.data);

  return (
    <div className="container container_inner">
      <div className={s.contentCart}>
        <CartInfo />
        <CartList productsCart={productsCart} />
        <CartAmount />
      </div>
    </div>
  );
};
