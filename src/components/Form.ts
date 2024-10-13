import { IForm, TOrderContacts, TOrderDetails } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement;
	protected _error: HTMLElement;
	protected container: HTMLFormElement;
	protected events: IEvents;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);

		this.container = container;
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._error = ensureElement<HTMLElement>('.form__errors', this.container);
		this.events = events;

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set error(value: string) {
		this.setText(this._error, value);
	}

	render(state: Partial<T> & IForm) {
		const { valid, error, ...inputs } = state;
		super.render({ valid, error });
		Object.assign(this, inputs);
		return this.container;
	}
}

export class DetailsOrder extends Form<TOrderDetails> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected _adress: HTMLInputElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const container = cloneTemplate<HTMLFormElement>(template);
		super(container, events);

		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);
		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);
		this._adress = container.adress;

		this.cardButton.addEventListener('click', () => {
			this.onInputChange('payment', 'card');
		});

		this.cashButton.addEventListener('click', () => {
			this.onInputChange('payment', 'cash');
		});
	}

	set adress(value: string) {
		this._adress.value = value;
	}
}

export class ContactsOrder extends Form<TOrderContacts> {
	protected _phone: HTMLInputElement;
	protected _email: HTMLInputElement;

	constructor(template: HTMLTemplateElement, events: IEvents) {
		const container = cloneTemplate<HTMLFormElement>(template);
		super(container, events);

		this._phone = container.phone;
		this._email = container.email;
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}
}
