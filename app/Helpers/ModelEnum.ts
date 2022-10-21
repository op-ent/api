import { DecoratorFn, LucidModel } from '@ioc:Adonis/Lucid/Orm'
// import { column as originalColumn } from '@ioc:Adonis/Lucid/Orm'

export type EnumDecorator = () => DecoratorFn

export const enumColumn: EnumDecorator = () => {
  return function decorateAsColumn(target, property) {
    const Model = target.constuctor as LucidModel
    Model.boot()
    Model.$addColumn(property, {
      prepare: (value: string[]): string => `{${value.join(',')}}`,
      consume: (value: string): string[] => value.slice(1, -1).split(','),
    })
  }
}

// declare module '@ioc:Adonis/Lucid/Orm' {
//   export const column: typeof originalColumn & { enum: EnumDecorator }
// }

// column.enum = enumColumn
