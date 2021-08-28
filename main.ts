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
			name: 'Choose',
			callback: () => this.changeCaseModal()
		});

		this.addCommand({
			id: 'changecase-camel',
			name: 'Camel',
			callback: () => this.changeToCamel()
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

		const subTitle = contentEl.createEl('div');
		subTitle.innerText = "Select option to change the word's case:";

		const { iframeAspectRatioContainer } = this.createIframeContainerEl(contentEl, this.selectedText);
		const caseInput = this.createCaseInput(iframeAspectRatioContainer, title);

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

	createIframeContainerEl(contentEl: HTMLElement, url: string): { iframeAspectRatioContainer: HTMLElement } {
		// Inline styling to make sure that the created iframe will keep the style even without the plugin

		// This container enforce the aspect ratio. i.e. it's height is based on the width * ratio
		const ratioContainer = contentEl.createEl('div');
		ratioContainer.style.display = 'block'
		ratioContainer.style.position = 'relative';
		ratioContainer.style.width = '100%';
		// The height is determined by the padding which respect the ratio
		// See https://www.benmarshall.me/responsive-iframes/
		ratioContainer.style.height = "0px";
		ratioContainer.style.setProperty('--aspect-ratio', '9/16');
		ratioContainer.style.paddingBottom = 'calc(var(--aspect-ratio) * 100%)';

		const iframe = ratioContainer.createEl('iframe');
		iframe.src = url;
		iframe.allow = "fullscreen"
		iframe.style.position = 'absolute';
		iframe.style.top = '0px';
		iframe.style.left = '0px';
		iframe.style.height = '100%';
		iframe.style.width = '100%';

		return {
			iframeAspectRatioContainer: ratioContainer
		};
	}

	createCaseInput(iframeRatioContainer: HTMLElement, title: HTMLHeadingElement): HTMLDivElement {
		const caseInputContainer = iframeRatioContainer.createEl('div');
		const inputLabelName = "case";
		caseInputContainer.className = "space-x"

		const inputLabel = caseInputContainer.createEl('label');
		inputLabel.setAttribute('for', inputLabelName);
		inputLabel.innerText = 'Case: ';

		const caseInput = new DropdownComponent(caseInputContainer)
		caseInput.addOptions({
			'default': 'Select Case', 
			'camel': 'camelCase', 
			'snake': 'snake-case', 
			'dot': 'dot.case',
			'title': 'Title Case',
			'sentence': 'Sentence case',
			'upper': 'UPPER CASE',
			'lower': 'lower case'
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
				default:
					break;
			}
			title.innerText = this.changedText;
		})

		return caseInputContainer;
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


function convertToCamel(selectedText: string): string {
		return selectedText.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		}).replace(/\s+/g, '');
}

function convertToSnake(selectedText: string): string {

}

function convertToTitle(selectedText: string): string {
	throw new Error('Function not implemented.');
}


function convertToSentence(selectedText: string): string {
	throw new Error('Function not implemented.');
}


function convertToLower(selectedText: string): string {
	throw new Error('Function not implemented.');
}


function convertToUpper(selectedText: string): string {
	throw new Error('Function not implemented.');
}


function convertToDot(selectedText: string): string {
	throw new Error('Function not implemented.');
}
