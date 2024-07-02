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
  private get ultimoBloco(): Bloco {
    return this.#chain.at(-1) as Bloco
  }
  private hashUltimoBloco() {
    return this.ultimoBloco.header.hashBloco
  }
  criarBloco(dados: any): Bloco['payload'] { // retornará apenas o payload do bloco, pq é o que a gente precisará trabalhar, o header vai ser criado em seguida na função que a gente vai minerar!
    const novoBloco: Bloco['payload'] = {
      sequencia: this.ultimoBloco.payload.sequencia + 1,
      timestamp: +new Date(),
      dados: dados,
      hashAnterior: this.hashUltimoBloco()
    }
    console.log(`Bloco #${novoBloco.sequencia} criado: ${JSON.stringify(novoBloco)}`)
    return novoBloco
  }
}