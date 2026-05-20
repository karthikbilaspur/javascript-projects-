class Counter {
  constructor(container, { id, value = 0, step = 1, min = null, max = null, title = 'Counter' }) {
    this.id = id;
    this.container = container;
    this.value = value;
    this.initialValue = value;
    this.step = step;
    this.min = min;
    this.max = max;

    // DOM elements
    this.valueDOM = container.querySelector('.value');
    this.titleDOM = container.querySelector('.counter-title');
    this.stepInput = container.querySelector('.step-input');
    this.minInput = container.querySelector('.min-input');
    this.maxInput = container.querySelector('.max-input');
    this.increaseBtn = container.querySelector('.increase');
    this.decreaseBtn = container.querySelector('.decrease');
    this.resetBtn = container.querySelector('.reset');
    this.deleteBtn = container.querySelector('.delete-counter');

    this.init();
  }

  init() {
    // Set initial DOM values
    this.titleDOM.textContent = `Counter ${this.id}`;
    this.stepInput.value = this.step;
    this.minInput.value = this.min ?? '';
    this.maxInput.value = this.max ?? '';
    this.updateDisplay();

    // Event listeners
    this.increaseBtn.addEventListener('click', () => this.changeValue(this.step));
    this.decreaseBtn.addEventListener('click', () => this.changeValue(-this.step));
    this.resetBtn.addEventListener('click', () => this.reset());
    this.deleteBtn.addEventListener('click', () => this.delete());
    
    this.stepInput.addEventListener('change', () => this.updateStep());
    this.minInput.addEventListener('change', () => this.updateLimits());
    this.maxInput.addEventListener('change', () => this.updateLimits());
  }

  changeValue(delta) {
    let newValue = this.value + delta;
    
    // Apply min/max limits
    if (this.min !== null && newValue < this.min) newValue = this.min;
    if (this.max !== null && newValue > this.max) newValue = this.max;
    
    if (newValue !== this.value) {
      this.value = newValue;
      this.updateDisplay();
      CounterManager.saveToStorage();
    }
  }

  updateDisplay() {
    this.valueDOM.textContent = this.value;
    this.updateColor();
    this.updateButtonStates();
  }

  updateColor() {
    if (this.value > 0) {
      this.valueDOM.style.color = 'var(--clr-green-dark)';
    } else if (this.value < 0) {
      this.valueDOM.style.color = 'var(--clr-red-dark)';
    } else {
      this.valueDOM.style.color = 'var(--clr-black)';
    }
  }

  updateButtonStates() {
    // Disable buttons if at limits
    this.increaseBtn.disabled = this.max !== null && this.value >= this.max;
    this.decreaseBtn.disabled = this.min !== null && this.value <= this.min;
  }

  updateStep() {
    const newStep = parseInt(this.stepInput.value);
    this.step = newStep > 0 ? newStep : 1;
    this.stepInput.value = this.step;
    CounterManager.saveToStorage();
  }

  updateLimits() {
    const minVal = this.minInput.value;
    const maxVal = this.maxInput.value;
    
    this.min = minVal === '' ? null : parseInt(minVal);
    this.max = maxVal === '' ? null : parseInt(maxVal);

    // Clamp current value if outside new limits
    if (this.min !== null && this.value < this.min) this.value = this.min;
    if (this.max !== null && this.value > this.max) this.value = this.max;
    
    this.updateDisplay();
    CounterManager.saveToStorage();
  }

  reset() {
    this.value = this.initialValue;
    this.updateDisplay();
    CounterManager.saveToStorage();
  }

  delete() {
    this.container.remove();
    CounterManager.removeCounter(this.id);
  }

  getData() {
    return {
      id: this.id,
      value: this.value,
      step: this.step,
      min: this.min,
      max: this.max,
      title: this.titleDOM.textContent
    };
  }
}

class CounterManager {
  static counters = [];
  static counterId = 0;

  static init() {
    this.loadFromStorage();
    this.bindGlobalEvents();
    
    // If no counters exist, create 2 defaults
    if (this.counters.length === 0) {
      this.addCounter(100);
      this.addCounter(200);
    }
  }

  static bindGlobalEvents() {
    document.querySelector('.add-counter').addEventListener('click', () => {
      this.addCounter(0);
    });
    
    document.querySelector('.clear-all').addEventListener('click', () => {
      if (confirm('Delete all counters and clear saved data?')) {
        localStorage.removeItem('counters');
        document.querySelector('.counters-wrapper').innerHTML = '';
        this.counters = [];
        this.counterId = 0;
      }
    });
  }

  static addCounter(initialValue = 0, savedData = null) {
    const wrapper = document.querySelector('.counters-wrapper');
    const template = document.getElementById('counter-template');
    const clone = template.content.cloneNode(true);
    const container = clone.querySelector('.counter');
    
    const id = savedData ? savedData.id : ++this.counterId;
    if (id > this.counterId) this.counterId = id;

    const config = savedData || { id, value: initialValue };
    const counter = new Counter(container, config);
    
    wrapper.appendChild(clone);
    this.counters.push(counter);
    this.saveToStorage();
  }

  static removeCounter(id) {
    this.counters = this.counters.filter(c => c.id !== id);
    this.saveToStorage();
  }

  static saveToStorage() {
    const data = this.counters.map(c => c.getData());
    localStorage.setItem('counters', JSON.stringify(data));
  }

  static loadFromStorage() {
    const data = localStorage.getItem('counters');
    if (data) {
      const countersData = JSON.parse(data);
      countersData.forEach(counterData => {
        this.addCounter(null, counterData);
      });
    }
  }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  CounterManager.init();
});