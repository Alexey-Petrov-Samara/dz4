import { useSelector } from 'react-redux';
import './index.css';

const SeachInfo = ({ searchText }) => {
  const products = useSelector((state) => state.products.data);
  const searchCount = products.length;

  return (
    searchText && (
      <section className="search-title">
        По запросу <span>{searchText}</span> найдено {searchCount} товаров
      </section>
    )
  );
};

export default SeachInfo;
