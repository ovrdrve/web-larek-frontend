import './scss/styles.scss';
import { ProductsData } from './components/ProductsData';
import { BasketData } from './components/BasketData';
import { OrderData } from './components/OrderData';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import {
	BasketProduct,
	GalleryProduct,
	PreviewProduct,
} from './components/Product';
import { ensureElement } from './utils/utils';
import {
	TBasketProductInfo,
	TGalleryProductInfo,
	TOrderContacts,
	TOrderDetails,
	TPayment,
	TPreviewProductInfo,
} from './types';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { ContactsOrder, DetailsOrder } from './components/Form';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

const galleryProductTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const previewProductTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const basketProductTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const detailsFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const modalElement = ensureElement<HTMLElement>('#modal-container');

const page = new Page(document.body, events);
const modal = new Modal(modalElement, events);
const basket = new Basket(basketTemplate, events);
const detailsForm = new DetailsOrder(detailsFormTemplate, events);
const contactsForm = new ContactsOrder(contactsFormTemplate, events);

api.getProductList().then((res) => {
	productsData.items = res;
});

events.on('products:changed', () => {
	page.gallery = productsData.items.map((item) => {
		const product = new GalleryProduct(galleryProductTemplate, events);
		return product.render({
			id: item.id,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('product:select', (product: TGalleryProductInfo) => {
	productsData.preview = product.id;
});

events.on('product:selected', (product: TPreviewProductInfo) => {
	const previewProduct = new PreviewProduct(previewProductTemplate, events);
	modal.render({
		content: previewProduct.render({
			id: product.id,
			description: product.description,
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
			isBtnDisabled: basketData.containsItem(product.id),
		}),
	});
});

events.on('basketProduct:add', (product: TPreviewProductInfo) => {
	basketData.addItem({
		id: product.id,
		title: product.title,
		price: product.price,
		index: basketData.items.length + 1,
	});
	product.isBtnDisabled = true;
	page.counter = basketData.items.length;
});

events.on('basketProduct:remove', (product: TBasketProductInfo) => {
	basketData.removeItem(product.id);
	basket.items = basketData.items.map((item, index) => {
		const product = new BasketProduct(basketProductTemplate, events);
		return product.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	basket.total = basketData.getTotal();
	page.counter = basketData.items.length;
	basket.setButton(basketData.getTotal() === 0);
});

events.on(`basket:open`, () => {
	basket.items = basketData.items.map((item, index) => {
		const product = new BasketProduct(basketProductTemplate, events);
		return product.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	modal.render({
		content: basket.render({ total: basketData.getTotal() }),
	});
	basket.setButton(basketData.getTotal() === 0);
});

events.on('orderDetails:open', () => {
	orderData.setOrderTotal({
		items: basketData.items.map((item) => item.id),
		total: basketData.getTotal(),
	});

	modal.render({
		content: detailsForm.render({
			payment: 'card',
			address: '',
			valid: false,
			error: '',
		}),
	});
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof TOrderDetails; value: string & TPayment }) => {
		orderData.setDetailsField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TOrderContacts; value: string }) => {
		orderData.setContactsField(data.field, data.value);
	}
);

events.on('validation.order:changed', (data: { error: string }) => {
	detailsForm.valid = data.error === '';
	detailsForm.error = data.error;
});

events.on('validation.contacts:changed', (data: { error: string }) => {
	contactsForm.valid = data.error === '';
	contactsForm.error = data.error;
});

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			error: '',
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.postOrder(orderData.getOrder())
		.then((order) => {
			const success = new Success(successTemplate, events);
			modal.render({
				content: success.render({
					total: order.total,
				}),
			});

			basketData.clear();
			page.counter = basketData.items.length;
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('order:finally', () => {
	modal.close();
});

events.on('modal:open', () => {
	page.lockPage(true);
});

events.on('modal:close', () => {
	page.lockPage(false);
});
