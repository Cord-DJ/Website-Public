import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { IItemInstance, IPreset, ItemInstance, Preset, UpdateCharacter } from '../api';
import { plainToInstance } from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  constructor(private http: HttpClient) {}

  async getItems(userId: string = '@me') {
    const response = await lastValueFrom(
      this.http.get<IItemInstance[]>(`${environment.apiEndpoint}/users/${userId}/items`)
    );

    return plainToInstance(ItemInstance, response);
  }

  async getPresets(userId: string = '@me') {
    const response = await lastValueFrom(
      this.http.get<IPreset[]>(`${environment.apiEndpoint}/users/${userId}/presets`)
    );

    return plainToInstance(Preset, response);
  }

  async updatePreset(position: number, character: UpdateCharacter, userId: string = '@me') {
    const response = await lastValueFrom(
      this.http.put<IPreset>(`${environment.apiEndpoint}/users/${userId}/presets/${position}`, { character })
    );

    return plainToInstance(Preset, response);
  }

  async resetPreset(position: number, userId: string = '@me') {
    const response = await lastValueFrom(
      this.http.delete<IPreset>(`${environment.apiEndpoint}/users/${userId}/presets/${position}`)
    );

    return plainToInstance(Preset, response);
  }
}
