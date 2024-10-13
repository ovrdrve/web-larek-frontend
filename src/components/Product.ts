import {
	TBasketProductInfo,
	TGalleryProductInfo,
	TPreviewProductInfo,
} from '../types';
import { ensureElement, cloneTemplate, bem } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Product<T> extends Component<T> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	id: string;

	constructor(container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
	}

	get title() {
		return this._title.textContent;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get price() {
		if (!(this._price.textContent === 'Бесценно')) {
			return parseInt(this._price.textContent, 10);
		} else {
			return 0;
		}
	}

	set price(value: number | null) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}
}

export class GalleryProduct extends Product<TGalleryProductInfo> {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected events: IEvents;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const container = cloneTemplate(template);
		super(container);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this.events = events;

		container.addEventListener('click', () => {
			this.events.emit('product:select', this);
		});
	}

	set image(src: string) {
		this.setImage(this._image, src);
	}

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			case 'другое':
				this._category.classList.add('card__category_other');
				break;
			case 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case 'кнопка':
				this._category.classList.add('card__category_button');
		}
	}
}

export class PreviewProduct extends Product<TPreviewProductInfo> {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected events: IEvents;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const container = cloneTemplate(template);
		super(container);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this.events = events;

		this._button.addEventListener('click', () =>
			this.events.emit('basketProduct:add', this)
		);
	}

	set image(src: string) {
		console.log;
		this.setImage(this._image, src);
	}

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			case 'другое':
				this._category.classList.add('card__category_other');
				break;
			case 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case 'кнопка':
				this._category.classList.add('card__category_button');
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set isBtnDisabled(state: boolean) {
		this.setDisabled(this._button, state);
	}
}

export class BasketProduct extends Product<TBasketProductInfo> {
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;
	protected events: IEvents;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const container = cloneTemplate(template);
		super(container);

		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this.events = events;

		this._button.addEventListener('click', () =>
			this.events.emit('basketProduct:remove', this)
		);
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}
}
