# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание типов данных

Тип оплаты заказа

```
type TPayment = 'card' | 'cash';
```

Тип категории товара

```
type TCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'дополнительно'
	| 'другое';
```

Товар

```
interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: TCategory;
	price: number | null;
}
```

Заказ

```
interface IOrder {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
```

Интерфейс модели данных товаров

```
interface IProductsData {
	items: IProduct[];
	preview: string | null;
}
```

Интерфейс модели данных корзины

```
interface IBasketData {
	items: TBasketProductInfo[];
	getTotal(): number;
	containsItem(id: string): boolean;
	addItem(item: TBasketProductInfo): void;
	removeItem(id: string): void;
}
```

Интерфейс модели данных заказа

```
interface IOrderData {
	getOrder(): IOrder;
	setOrderTotal(data: TOrderTotal): void;
	setContactsField(field: keyof TOrderContacts, value: string): void;
	setDetailsField(field: keyof TOrderDetails, value: string & TPayment): void
}
```

Данные товара, использующиеся в корзине товаров

```
type TBasketProductInfo = Pick<IProduct, 'id' | 'title' | 'price'> & {
	index: number;
};
```

Данные товара, используещиеся в галерее

```
type TGalleryProductInfo = Omit<IProduct, 'description'>;
```

Данные товара, использующиеся в превью товара

```
type TPreviewProductInfo = IProduct & { isBtnDisabled: boolean };
```

Данные заказа, использующиеся в корзине товаров

```
type TOrderTotal = Pick<IOrder, 'items' | 'total'>;
```

Данные заказа, которые вводятся в модальном окне почты и типа оплаты

```
type TOrderDetails = Pick<IOrder, 'address' | 'payment'>;
```

Данные заказа, которые вводятся в модальном окне контактных данных

```
type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;
```

## Архитектура приложения

Приложения написано согласно паттерну MVP, что подразумевает под собой разбитие его кода на три слоя:

- Слой данных (модель), отвечает за хранение и обработку данных,
- Слой представления, отвечает за отображение компонентов на странице,
- Презентер, отвечает за связь между данными и представлением.

### Базовый код

#### Класс Api

Отвечает за создание и отправку запросов на сервер.\
В конструктор класса передается базовый адрес сервера и необязательный объект с дополнительными заголовками.

Методы:

- `get` - принимает в качестве параметра эндпоинт, выполняет GET запрос и возвращает промис с объектом ответа сервера.
- `post` - принимает в качестве параметров эндпоинт, объект с данными, который будет преобразован в JSON формат и передан в теле запроса, метод (POST по умолчанию), выполняет запрос и возвращает промис с объектом ответа сервера.

#### Класс EventEmitter

Брокер событий, отвечает за генерацию, отправку и подписку на события.

Методы:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает коллбек, инициализирующий событие, переданное в параметре, при вызове

#### Класс Component

Универсальный класс-компонент для наследования другими компонентами, предоставляет основной метод `render`, который возвращает разметку полностью заполненной карточки и методы для работы с разметкой экземпляров дочерних классов.

### Коммуникация

#### Класс AppApi

Принимает экземпляр класса `EventEmitter` и предоставляет методы для работы с серверной частью приложения.

### Слой данных

#### Класс ProductsData

Класс отвечает за хранение массива товаров и товара, выбранного для просмотра.\
В конструктор принимает экземпляр класса `EventEmitter`

Поля:

- `_items` - хранит массив объектов товаров
- `_preview` - хранит id товара, выбранного для просмотра
- `events` - экземпляр класса `EventEmitter` для инициации событий при изменении данных

Методы:

- геттеры и сеттеры для получения и установки полей класса

#### Класс BasketData

Класс отвечает за хранение и работу с данными товаров, помещенных в корзину товаров.\
В конструктор принимает экземпляр класса `EventEmitter`

Поля:

- `_items` - хранит массив объектов товаров корзины
- `events` - экземпляр класса `EventEmitter` для инициации событий при изменении данных

Методы:

- `getTotal` - возвращает число, равное сумме стоимостей товаров в корзине
- `containsItem` - принимает в качестве параметра айди товара и возвращает его наличие
- `addItem` - принимает в качестве параметра товар и добавляет его в корзину
- `removeItem` - принимает в качестве параметра id товара и удаляет из корзины товар с таким id
- `clear` - очищает корзину
- геттер для получения поля класса

#### Класс OrderData

Класс отвечает за хранение и работу с данными заказа.\
В конструктор принимает экземпляр класса `EventEmitter`

Поля:

- `payment` - тип оплаты
- `email` - почта пользователя
- `phone` - телефон пользователя
- `address` - адрес доставки
- `total` - сумма заказа
- `items` - id товаров в заказе
- `error` - сообщение об ошибке валидации
- `events` - экземпляр класса `EventEmitter` для инициации событий при изменении данных

Методы:

- `getOrder` - возвращает полный объект заказа для отправки на сервер
- `setOrderTotal` - устанавливает сумму заказа и id товаров в заказе
- `setOrderDetails` - устанавливает тип оплаты и адрес доставки
- `setOrderContacts` - устанавливает почту и телефон пользователя
- `isDetailsValid` - валидирует детали заказа
- `isContactsValid` - валидирует контакты заказа

### Слой отображения

#### Класс Page

Наследует класс Component. Класс служит для работы с главной страницей приложения.\
В конструктор принимает элемент главной страницы и экземпляр класса `EventEmitter` для инициации событий.

Поля:

- `_counter` - элемент счетчика товаров корзины
- `_gallery` - элемент контейнера галереи товаров
- `_wrapper` - элемент обертки страницы
- `basketButton` - элемент кнопки корзины
- `events` - экземпляр класса `EventEmitter`

Методы:

- cеттеры для установки полей класса

#### Класс Form

Наследует класс Component. Родительский класс для всех видов форм в приложении.\
В конструктор принимает контейнер формы.\
В полях класса содержатся базовые элементы разметки формы.
В конструктор принимает темплейт формы и экземпляр класса `EventEmitter` для инициации событий.

Методы:

- сеттеры для установки полей класса
- `render` - расширяет родительский метод класса Component, добавляя поля ввода в разметку

#### Класс DetailsOrder

Наследует класс Component. Класс служит для работы с разметкой формы деталей заказа и установки соответствующих слешателей.\
В конструктор принимает темплейт карточки и экземпляр класса `EventEmitter` для инициации событий.\
В полях класса добавляются поля ввода данной формы.\

Методы:

- сеттеры для установки полей класса

#### Класс ContactsOrder

Наследует класс Component. Класс служит для работы с разметкой формы деталей заказа.\
В конструктор принимает темплейт карточки и экземпляр класса `EventEmitter` для инициации событий.\
В полях класса добавляются поля ввода данной формы.\

Методы:

- сеттеры для установки полей класса

#### Класс Modal

Наследует класс Component. Класс служит для работы с разметкой универсального модального окна.\
В конструктор принимает элемент модального окна и экземпляр класса `EventEmitter` для инициации событий.

Поля:

- `_content_` - контейнер содержимого модального окна
- `closeButton` - элемент кнопки закрытия
- `events` - экземпляр класса `EventEmitter`

Методы:

- `render` - расширяет родительский метод класса Component, добавляет открытие модального окна при рендере
- `open` - открывает модальное окно и вешает слушатели на закрытие
- `close` - закрывает модальное окно по нажатию Esc или клику на крестик/оверлей, снимает слушатели на закрытие и очищает отображаемый в нем контент

#### Класс Product

Наследует класс Component. Родительский класс для всех видов карточек с товарами в приложении.\
В конструктор принимает контейнер карточки.\
В полях класса содержатся базовые элементы разметки карточки.

Методы:

- геттеры и сеттеры для получения и установки полей класса

#### Класс GalleryProduct

Наследует класс Product. Класс служит для работы с разметкой карточки в галерее товаров и установки соответствующих слешателей.\
В конструктор принимает темплейт карточки и экземпляр класса `EventEmitter` для инициации событий.\
В полях класса добавляются уникальные элементы разметки карточки.\

Методы:

- сеттеры для установки полей класса

#### Класс PreviewProduct

Наследует класс Product. Класс служит для работы с разметкой карточки для превью и установки соответствующих слешателей.\
В конструктор принимает темплейт карточки и экземпляр класса `EventEmitter` для инициации событий.\
В полях класса добавляются уникальные элементы разметки карточки.\

Методы:

- сеттеры для установки полей класса

#### Класс BasketProduct

Наследует класс Product. Класс служит для работы с разметкой карточки в корзине товаров и установки соответствующих слешателей.\
В конструктор принимает темплейт карточки и экземпляр класса `EventEmitter` для инициации событий.\
В полях класса добавляются уникальные элементы разметки карточки.\

Методы:

- сеттеры для установки полей класса

#### Класс Basket

Наследует класс Component. Класс служит для создания разметки корзины товаров из соответствующего темплейта.\
В конструктор принимает темплейт корзины товаров и экземпляр класса `EventEmitter` для инициации событий.

Поля:

- `_basket` - элемент списка товаров корзины
- `_total` - элемент стоимости товаров корзины
- `_button` - элемент кнопки оформления заказа
- `events` - экземпляр класса `EventEmitter`

Методы:

- `setButton` - принимает логическое условие и устанавливает состояние кнопки оформления заказа
- сеттеры для установки полей класса

#### Класс Success

Наследует класс Component. Класс служит для создания разметки сообщения об успешном заказе из соответствующего темплейта.\
В конструктор принимает темплейт сообщения и экземпляр класса `EventEmitter` для инициации событий.

Поля:

- `_close` - элемент кнопки для закрытия
- `_total` - элемент с информацией о сумме заказа
- `events` - экземпляр класса `EventEmitter`

Методы:

- сеттер для установки значения суммы заказа

### Слой презентера

Презентер не имеет отдельного класса, код презентера, опизывающий взаимодействие между компонентами находится в файле `index.ts`

## Взаимодействие внутри приложения

Приложение использует событийно-ориентированный подход.\
Взаимодействие производится путем генерации событий с помощью брокера событий и обработки их в слушателях, описанный в файле `index.ts`.\

### Список всех генерируемых событий

#### События, генерируеммые в слое данных

- `products:changed` - список товаров изменен
- `product:selected` - товар, выбранный для просмотра, изменился
- `basketProducts:changed` - список товаров в корзине изменен
- `order:changed` - данные заказа изменены
- `validation.order:changed` - форма деталей заказа провалидирована
- `validation.contacts:changed` - форма контактов заказа провалидирована

#### События, генерируемые в слое отображения

- `product:select` - выбор товара для просмотра
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `basket:open` - необходима отрисовка корзины
- `orderDetails:open` - необходима отрисовка формы с типом оплаты и адреса доставки заказа
- `basketProduct:add` - выбор товара для добавления в корзину
- `basketProduct:remove` - выбор товара для удаления из корзины
- `order.payment:input` - событие выбора типа оплаты
- `order.address:input` - событие ввода данных внутри поля адреса заказа
- `order:submit` - событие, генерируемое при сабмите формы с типом оплаты и адреса доставки заказа
- `contacts.email:input` - событие ввода данных внутри поля почты заказа
- `contacts.phone:input` - событие ввода данных внутри поля номера телефона заказа
- `contacts:submit` - событие, генерируемое при сабмите формы с контактами заказа
- `order:finally` - событие завершения заказа
