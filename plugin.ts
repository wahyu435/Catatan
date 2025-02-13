import { registerPlugin } from 'acode-plugin';

class NotesPlugin {
  private notes: string[] = [];

  constructor(private acode: any) {}

  async init() {
    this.notes = await this.loadNotes();
    this.renderNotes();
    this.addNoteButton();
  }

  async loadNotes(): Promise<string[]> {
    try {
      const notes = await this.acode.fs.readFile('/notes.json');
      return JSON.parse(notes || '[]');
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  async saveNotes() {
    try {
      await this.acode.fs.writeFile('/notes.json', JSON.stringify(this.notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    if (notesContainer) {
      notesContainer.innerHTML = this.notes
        .map((note) => `<div class="note">${note}</div>`)
        .join('');
    } else {
      const newNotesContainer = document.createElement('div');
      newNotesContainer.id = 'notes-container';
      newNotesContainer.innerHTML = this.notes
        .map((note) => `<div class="note">${note}</div>`)
        .join('');
      document.body.appendChild(newNotesContainer);
    }
  }

  addNoteButton() {
    const addButton = document.createElement('button');
    addButton.innerText = 'Add Note';
    addButton.onclick = () => this.addNote();
    document.body.appendChild(addButton);
  }

  async addNote() {
    const noteText = prompt('Enter your note:');
    if (noteText) {
      this.notes.push(noteText);
      await this.saveNotes();
      this.renderNotes();
    }
  }
}

registerPlugin('notes', (acode) => new NotesPlugin(acode));