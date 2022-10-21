import { DecoratorFn, LucidModel } from '@ioc:Adonis/Lucid/Orm'
// import { column as originalColumn } from '@ioc:Adonis/Lucid/Orm'

export type JsonDecorator = () => DecoratorFn

export const jsonColumn: JsonDecorator = () => {
  return function decorateAsColumn(target, property) {
    const Model = target.constuctor as LucidModel
    Model.boot()
    Model.$addColumn(property, {
      prepare: (value: {}): string => JSON.stringify(value),
      consume: (value: string): {} => JSON.parse(value),
    })
  }
}

// declare module '@ioc:Adonis/Lucid/Orm' {
//   export const column: typeof originalColumn & { json: JsonDecorator }
// }

// column.json = jsonColumn
