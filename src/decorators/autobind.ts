// Auto Bind
export function AutoBind(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,

    get() {
      const boundFn = originalMethod.bind(this);

      return boundFn;
    },
  };

  return adjustedDescriptor;
}
