import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ID } from '../../../../api';

@Component({
  selector: 'ui-select-list',
  templateUrl: './ui-select-list.component.html',
  styleUrls: ['./ui-select-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: UiSelectListComponent
    }
  ]
})
export class UiSelectListComponent implements ControlValueAccessor {
  _value: ID[] = [];
  touched = false;
  onChange = (source?: ID[]) => {};
  onTouched = () => {};

  @Input() options?: [ID, string][] | null;

  @Input()
  get value() {
    return this._value;
  }

  set value(v) {
    if (this._value !== v) {
      this._value = v ?? [];
      this.onChange(this._value);
    }
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  hasValue(id: ID) {
    return this.value.includes(id);
  }

  click(id: ID) {
    this.value = this.hasValue(id) ? this.value.filter(x => x !== id) : [...this.value, id];
    this.changeDetectorRef.markForCheck();
  }

  writeValue(source: ID[]) {
    this.value = source;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
