import { IPage } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _wrapper: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		this.events = events;

		this.basketButton.addEventListener('click', () =>
			events.emit('basket:open')
		);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set gallery(products: HTMLElement[]) {
		this._gallery.replaceChildren(...products);
	}

	lockPage(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
