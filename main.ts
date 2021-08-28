import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, DropdownComponent} from 'obsidian';

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.addRibbonIcon('dice', 'Change Case', () => {
			new Notice('Quick change activated');
			this.changeCaseModal()
		});

		this.addCommand({
			id: 'open-changecase-modal',
			name: '',
			callback: () => this.changeCaseModal()
		});

		this.addCommand({
			id: 'changecase-camel',
			name: 'Camel',
			callback: () => this.changeToCamel()
		});

		this.addCommand({
			id: 'changecase-snake',
			name: 'Snake',
			callback: () => this.changeToSnake()
		});
		
				this.addCommand({
			id: 'changecase-dot',
			name: 'Dot',
			callback: () => this.changeToDot()
		});
				this.addCommand({
			id: 'changecase-dash',
			name: 'Dash',
			callback: () => this.changeToDash()
		});
				this.addCommand({
			id: 'changecase-title',
			name: 'Title',
			callback: () => this.changeToTitle()
		});
		this.addCommand({
			id: 'changecase-sentence',
			name: 'Sentence',
			callback: () => this.changeToSentence()
		});
		this.addCommand({
			id: 'changecase-upper',
			name: 'Upper',
			callback: () => this.changeToUpper()
		});
		this.addCommand({
			id: 'changecase-lower',
			name: 'Lower',
			callback: () => this.changeToLower()
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	changeCaseModal(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				new SampleModal(this.app, selectedText, editor).open();
			}
		} else {
			new Notice('Select text to change case.');
		}
	}

	changeToCamel(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				editor.replaceSelection(convertToCamel(selectedText));
			}
		} else {
			new Notice('Select text to change case.');
		}
	}

	changeToSnake(): void {
	let activeLeaf: any = this.app.workspace.activeLeaf;
	let editor = activeLeaf.view.sourceMode.cmEditor;
	let selectedText = editor.somethingSelected()
	? editor.getSelection()
	: false;

	if (selectedText) {
		if (activeLeaf) {
			editor.replaceSelection(convertToSnake(selectedText));
		}
	} else {
		new Notice('Select text to change case.');
	}
	}
	
	changeToDot(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				editor.replaceSelection(convertToDot(selectedText));
			}
		} else {
			new Notice('Select text to change case.');
		}
	}

	changeToDash(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				editor.replaceSelection(convertToDash(selectedText));
			}
		} else {
			new Notice('Select text to change case.');
		}
	}

	changeToTitle(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				editor.replaceSelection(convertToTitle(selectedText));
			}
		} else {
			new Notice('Select text to change case.');
		}
	}
	
	changeToSentence(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				editor.replaceSelection(convertToSentence(selectedText));
			}
		} else {
			new Notice('Select text to change case.');
		}
	}
	
	changeToUpper(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				editor.replaceSelection(convertToUpper(selectedText));
			}
		} else {
			new Notice('Select text to change case.');
		}
	}
	
	changeToLower(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;

		if (selectedText) {
			if (activeLeaf) {
				editor.replaceSelection(convertToLower(selectedText));
			}
		} else {
			new Notice('Select text to change case.');
		}
	}
	
	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	selectedText: string;
	changedText: string;
	success: boolean;
	generatedIframe: string;
	editor: any;
	
	constructor(app: App, selectedText: string, editor: any) {
		super(app);
		this.selectedText = selectedText
		this.editor = editor
		this.containerEl.className += ' iframe__modal';
	}

	onOpen() {
		let { contentEl } = this;

		const container = contentEl.createEl('div');
		container.className = 'iframe__modal__container';

		const title = contentEl.createEl('h2');
		title.innerText = this.selectedText;

		const subTitle = contentEl.createEl('p');
		subTitle.innerText = "Select option to change the word's case:";

		const { caseInputContainer } = this.caseInputContainer(contentEl, this.selectedText);
		const caseInput = this.createCaseInput(caseInputContainer, title);

		const cancelButton = contentEl.createEl('button');
		cancelButton.setText('Cancel');
		cancelButton.onclick = (e) => {
			e.preventDefault();
			this.close();
		};

		const okButton = contentEl.createEl('button');
		okButton.setText('Change');
		okButton.className = 'mod-warning';
		okButton.onclick = (e) => {
			e.preventDefault();
			this.editor.replaceSelection(this.changedText);
			this.close();
		};

		const buttonContainer = contentEl.createEl('div');
		buttonContainer.className = 'button__container space-x';
		buttonContainer.appendChild(okButton);
		buttonContainer.appendChild(cancelButton);

		container.appendChild(title);
		container.appendChild(subTitle);
		container.appendChild(caseInput);
		container.appendChild(buttonContainer);
		contentEl.appendChild(container);
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}

	caseInputContainer(contentEl: HTMLElement, url: string): { caseInputContainer: HTMLElement } {
		// Inline styling to make sure that the created iframe will keep the style even without the plugin

		// This container enforce the aspect ratio. i.e. it's height is based on the width * ratio
		const container = contentEl.createEl('div');
		container.style.width = '100%';
		// The height is determined by the padding which respect the ratio
		// See https://www.benmarshall.me/responsive-iframes/
		container.style.height = "100%";

		return {
			caseInputContainer: container
		};
	}

	createCaseInput(caseInputContainer: HTMLElement, title: HTMLHeadingElement): HTMLDivElement {
		const container = caseInputContainer.createEl('div');
		const inputLabelName = "case";
		container.className = "space-x"

		const inputLabel = container.createEl('label');
		inputLabel.setAttribute('for', inputLabelName);
		inputLabel.innerText = 'Case: ';

		const caseInput = new DropdownComponent(container)
		caseInput.addOptions({
			'default': 'Select Case', 
			'camel': 'camelCase', 
			'snake': 'snake_case', 
			'dot': 'dot.case',
			'dash': 'dash-case',
			'title': 'Title Case',
			'sentence': 'Sentence case',
			'upper': 'UPPER CASE',
			'lower': 'lower case',
		})

		caseInput.onChange((value) => {
			switch (value) {
				case 'camel':
					this.changedText = convertToCamel(this.selectedText);
					break;
				case 'snake':
					this.changedText = convertToSnake(this.selectedText);
					break;
				case 'title':
					this.changedText = convertToTitle(this.selectedText);
					break;
				case 'sentence':
					this.changedText = convertToSentence(this.selectedText);
					break;
				case 'lower':
					this.changedText = convertToLower(this.selectedText);
					break;
				case 'upper':
					this.changedText = convertToUpper(this.selectedText);
					break;
				case 'dot':
					this.changedText = convertToDot(this.selectedText);
					break;
				case 'dash':
					this.changedText = convertToDash(this.selectedText);
					break;
				default:
					break;
			}
			title.innerText = this.changedText;
		})

		return container;
	}

}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}


function convertToCamel(str: string): string {
		return str.replace(/(\s|_|-|\.)|\B(?=[A-Z])/g, " ")
			.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		}).replace(/\s+/g, '');
}

function convertToSnake(str: string): string {
    return str.replace(/(\s|_|-|\.)|\B(?=[A-Z])/g, " ")
			.split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
}

function convertToTitle(str: string): string {
    return str.replace(/(\s|_|-|\.)|\B(?=[A-Z])/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}


function convertToSentence(str: string): string {
	return str.replace(/(\s|_|-|\.)|\B(?=[A-Z])/g, " ").toLowerCase()
		.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function(c) { return c.toUpperCase() });
}

function convertToDot(str: string): string {
	return str.toLowerCase().replace(/(\s|_|-|\.)|\B(?=[A-Z])/g, " ")
			.split(/ |\B(?=[A-Z])/)
      .join('.');
}

function convertToDash(str: string): string {
	return str.toLowerCase().replace(/(\s|_|-|\.)|\B(?=[A-Z])/g, " ")
			.split(/ |\B(?=[A-Z])/)
      .join('-');
}

function convertToLower(str: string): string {
		return str.toLowerCase();
}

function convertToUpper(str: string): string {
		return str.toUpperCase();
}

