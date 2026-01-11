import { useState, useEffect, useRef } from 'react';
import type { ScreenType } from '../types';
import './HomeScreen.css';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  currentScreen?: ScreenType;
  scrollToSection?: 'warehouse' | 'products' | null;
  onScrollComplete?: () => void;
}

function HomeScreen({ onNavigate, currentScreen = 'home', scrollToSection, onScrollComplete }: HomeScreenProps) {
  const [isWarehouseExpanded, setIsWarehouseExpanded] = useState(false);
  const [isProductsExpanded, setIsProductsExpanded] = useState(false);
  const [isParcelsExpanded, setIsParcelsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const warehouseSectionRef = useRef<HTMLDivElement>(null);
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const parcelsSectionRef = useRef<HTMLDivElement>(null);

  const warehouseData = {
    name: 'DESexpress二十二',
    phone: '15904678656',
    address: '黑龙江省鸡西市鸡冠区东太三组义立国际多邮库批发客户二十二',
  };

  // Автоматически раскрывать раздел "Товары", если текущий экран в его подразделах
  useEffect(() => {
    const productsScreens: ScreenType[] = ['orders', 'products', 'products-sent', 'products-problematic', 'products-returns', 'products-archive'];
    if (productsScreens.includes(currentScreen)) {
      setIsProductsExpanded(true);
    }
  }, [currentScreen]);

  // Автоматически раскрывать раздел "Посылки", если текущий экран в его подразделах
  useEffect(() => {
    const parcelsScreens: ScreenType[] = ['parcels'];
    if (parcelsScreens.includes(currentScreen)) {
      setIsParcelsExpanded(true);
    }
  }, [currentScreen]);

  // Обработка скроллинга из внешних источников (например, из бокового меню)
  useEffect(() => {
    if (scrollToSection === 'warehouse' && warehouseSectionRef.current) {
      // Открываем секцию, если она закрыта
      if (!isWarehouseExpanded) {
        setIsWarehouseExpanded(true);
      }
      // Прокручиваем после задержки
      setTimeout(() => {
        if (warehouseSectionRef.current) {
          warehouseSectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          onScrollComplete?.();
        }
      }, isWarehouseExpanded ? 50 : 250); // Больше задержка, если нужно открыть секцию
    } else if (scrollToSection === 'products' && productsSectionRef.current) {
      // Открываем секцию, если она закрыта
      if (!isProductsExpanded) {
        setIsProductsExpanded(true);
      }
      // Прокручиваем после задержки
      setTimeout(() => {
        if (productsSectionRef.current) {
          productsSectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          onScrollComplete?.();
        }
      }, isProductsExpanded ? 50 : 250); // Больше задержка, если нужно открыть секцию
    }
  }, [scrollToSection, isWarehouseExpanded, isProductsExpanded, onScrollComplete]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Функция для плавного скроллинга к секции
  const performScrollToSection = (ref: React.RefObject<HTMLDivElement>, isExpanded: boolean, setIsExpanded: (value: boolean) => void) => {
    const performScroll = () => {
      if (ref.current) {
        // Используем простой и надежный scrollIntoView
        ref.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    };

    if (!isExpanded) {
      // Сначала открываем секцию
      setIsExpanded(true);
      // Затем прокручиваем после задержки, чтобы анимация открытия успела начаться
      setTimeout(() => {
        performScroll();
      }, 200); // Задержка для начала анимации раскрытия
    } else {
      // Если секция уже открыта, просто прокручиваем
      performScroll();
    }
  };

  // Обработчик клика на секцию "Адрес склада в Китае"
  const handleWarehouseClick = () => {
    if (isWarehouseExpanded) {
      // Если секция открыта, закрываем её
      setIsWarehouseExpanded(false);
    } else {
      // Закрываем другие секции
      setIsProductsExpanded(false);
      setIsParcelsExpanded(false);
      // Открываем и скроллим
      performScrollToSection(warehouseSectionRef, isWarehouseExpanded, setIsWarehouseExpanded);
    }
  };

  // Обработчик клика на секцию "Товары"
  const handleProductsClick = () => {
    if (isProductsExpanded) {
      // Если секция открыта, закрываем её
      setIsProductsExpanded(false);
    } else {
      // Закрываем другие секции
      setIsWarehouseExpanded(false);
      setIsParcelsExpanded(false);
      // Открываем и скроллим
      performScrollToSection(productsSectionRef, isProductsExpanded, setIsProductsExpanded);
    }
  };

  // Обработчик клика на секцию "Посылки"
  const handleParcelsClick = () => {
    if (isParcelsExpanded) {
      // Если секция открыта, закрываем её
      setIsParcelsExpanded(false);
    } else {
      // Закрываем другие секции
      setIsWarehouseExpanded(false);
      setIsProductsExpanded(false);
      // Открываем и скроллим
      performScrollToSection(parcelsSectionRef, isParcelsExpanded, setIsParcelsExpanded);
    }
  };

  return (
    <div className="home-screen">
      <div className="balance-card-horizontal">
        <div className="balance-info">
          <div className="balance-label">Мой баланс</div>
          <div className="balance-amount">0 ₽</div>
        </div>
        <button className="balance-btn-compact">Пополнить</button>
      </div>

      <div className="action-buttons-grid">
        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('create-order')}
        >
          <span className="action-icon-small">📦</span>
          <span className="action-text-large">Создать заказ</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('instructions')}
        >
          <span className="action-icon-small">📋</span>
          <span className="action-text-large">Инструкция по заказам</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('parcels')}
        >
          <span className="action-icon-small">📮</span>
          <span className="action-text-large">Посылки</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('calculator')}
        >
          <span className="action-icon-small">🧮</span>
          <span className="action-text-large">Калькулятор</span>
        </button>
      </div>

      <div className="warehouse-section" ref={warehouseSectionRef}>
        <div 
          className="warehouse-banner" 
          onClick={handleWarehouseClick}
        >
          <div className="warehouse-banner-content">
            <span className="warehouse-icon">📍</span>
            <span className="warehouse-text">Адрес склада в Китае</span>
          </div>
          <span className={`warehouse-arrow ${isWarehouseExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>

        <div className={`warehouse-details ${isWarehouseExpanded ? 'expanded' : ''}`}>
          <div className="warehouse-info-hint">
            Отправляйте товары на этот адрес. Используйте кнопки копирования для удобства.
          </div>

          <div className="address-field">
            <label>Имя получателя</label>
            <div className="field-with-copy">
              <div className="field-value">{warehouseData.name}</div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(warehouseData.name, 'name')}
              >
                {copiedField === 'name' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="address-field">
            <label>Номер телефона</label>
            <div className="field-with-copy">
              <div className="field-value">{warehouseData.phone}</div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(warehouseData.phone, 'phone')}
              >
                {copiedField === 'phone' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="address-field">
            <label>Адрес</label>
            <div className="field-with-copy">
              <div className="field-value address-text">{warehouseData.address}</div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(warehouseData.address, 'address')}
              >
                {copiedField === 'address' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="products-section" ref={productsSectionRef}>
        <div 
          className="products-banner" 
          onClick={handleProductsClick}
        >
          <div className="products-banner-content">
            <span className="products-icon">📦</span>
            <span className="products-text">Товары</span>
          </div>
          <span className={`products-arrow ${isProductsExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>

        <div className={`products-details ${isProductsExpanded ? 'expanded' : ''}`}>
          <button 
            className={`products-subitem ${currentScreen === 'orders' ? 'active' : ''}`}
            onClick={() => onNavigate('orders')}
          >
            <span>Ожидают поступления на склад</span>
          </button>
          <button 
            className={`products-subitem ${currentScreen === 'products' ? 'active' : ''}`}
            onClick={() => onNavigate('products')}
          >
            <span>Товары на складе</span>
          </button>
          <button 
            className={`products-subitem ${currentScreen === 'products-sent' ? 'active' : ''}`}
            onClick={() => onNavigate('products-sent')}
          >
            <span>Отправленные</span>
          </button>
          <button 
            className={`products-subitem ${currentScreen === 'products-problematic' ? 'active' : ''}`}
            onClick={() => onNavigate('products-problematic')}
          >
            <span>*Проблемные</span>
          </button>
          <button 
            className={`products-subitem ${currentScreen === 'products-returns' ? 'active' : ''}`}
            onClick={() => onNavigate('products-returns')}
          >
            <span>*Возвраты</span>
          </button>
          <button 
            className={`products-subitem ${currentScreen === 'products-archive' ? 'active' : ''}`}
            onClick={() => onNavigate('products-archive')}
          >
            <span>*Архив</span>
          </button>
        </div>
      </div>

      <div className="parcels-section" ref={parcelsSectionRef}>
        <div 
          className="parcels-banner" 
          onClick={handleParcelsClick}
        >
          <div className="parcels-banner-content">
            <span className="parcels-icon">📮</span>
            <span className="parcels-text">Посылки</span>
          </div>
          <span className={`parcels-arrow ${isParcelsExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>

        <div className={`parcels-details ${isParcelsExpanded ? 'expanded' : ''}`}>
          <button 
            className={`parcels-subitem ${currentScreen === 'parcels' ? 'active' : ''}`}
            onClick={() => onNavigate('parcels')}
          >
            <span>В обработке</span>
          </button>
          <button 
            className={`parcels-subitem ${currentScreen === 'parcels' ? 'active' : ''}`}
            onClick={() => onNavigate('parcels')}
          >
            <span>Отправленные</span>
          </button>
          <button 
            className={`parcels-subitem ${currentScreen === 'parcels' ? 'active' : ''}`}
            onClick={() => onNavigate('parcels')}
          >
            <span>*Архив</span>
          </button>
        </div>
      </div>

      <div className="recipients-button-container">
        <button 
          className="recipients-button"
          onClick={() => onNavigate('recipients')}
        >
          <span className="recipients-icon">👥</span>
          <span className="recipients-text">Получатели</span>
        </button>
        <button 
          className="recipients-button"
          onClick={() => onNavigate('delivery-address')}
        >
          <span className="recipients-icon">🏠</span>
          <span className="recipients-text">
            Адрес доставки<br />по РФ
          </span>
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;
