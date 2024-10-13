import { IBasket } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { cloneTemplate, ensureElement } from '../utils/utils';

export class Basket extends Component<IBasket> {
	protected _basket: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	protected events: IEvents;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const container = cloneTemplate(template);
		super(container);

		this._basket = ensureElement<HTMLElement>('.basket__list', container);
		this._total = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
		this.events = events;

		this._button.addEventListener('click', () =>
			this.events.emit('orderDetails:open')
		);
	}

	set items(products: HTMLElement[]) {
		this._basket.replaceChildren(...products);
	}

	set total(value: number) {
		this.setText(this._total, `${String(value)} синапсов`);
	}

	setButton(isValid: boolean) {
		this.setDisabled(this._button, isValid);
	}
}
