import { Component } from './base/Component';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { ISuccess } from '../types';
import { IEvents } from './base/events';

export class Success extends Component<ISuccess> {
	protected _close: HTMLButtonElement;
	protected _total: HTMLElement;
	protected events: IEvents;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const container = cloneTemplate(template);
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.events = events;

		this._close.addEventListener('click', () => {
			events.emit('order:finally');
		});
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
