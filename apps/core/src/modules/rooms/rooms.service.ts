import { Injectable } from '@nestjs/common'

import { RoomsInterface } from '@app/common/store/rooms.store'

@Injectable()
export class RoomsService {
  async findRoomByToken(token: string): Promise<RoomsInterface> {
    // Implementar a validação do token
    // Retornar true se o token for válido, caso contrário, false
    return {
      terminationId: 'abc123',
      chosenMessage: 'É melhor seguirmos caminhos diferentes...',
      scenario: 'chuva_na_janela',
      soundtrack: 'sad_piano.mp3',
    }
  }
}
