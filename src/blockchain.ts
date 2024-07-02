import { hash } from "./utils"

export interface Bloco {
  header: {
    nonce: number
    hashBloco: string
  }
  payload: {
    sequencia: number // número que o bloco tá (?)
    timestamp: number // data atual em forma de numeros
    dados: any // qualquer tipo de dado
    hashAnterior: string
  }
}

export class Blockchain {
  #chain: Bloco[] = []
  private prefixoPow = '0'

  constructor(private readonly dificuldade: number = 4) {
    this.#chain.push(this.criarBlocoGenesis())
  }

  private criarBlocoGenesis(): Bloco {
    const payload: Bloco['payload'] = {
      sequencia: 0, // primeiro bloco por isso 0
      timestamp: +new Date(), // +new Date() converte a data em número
      dados: 'Bloco inicial',
      hashAnterior: ''
    }
    return {
      header: {
        nonce: 0,
        hashBloco: hash(JSON.stringify(payload))// Hash de tudo que tá dentro do payload
      },
      payload
    }
  }
}