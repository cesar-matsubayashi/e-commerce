export default interface ValidatorInterface<T> {
  validate(entiry: T): void;
}
