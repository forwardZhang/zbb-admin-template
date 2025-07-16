import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

/**
 * @param providerComponentName - 提供上下文的组件的名称。
 *
 * 在某些情况下，上下文可能来自多个组件。在这种情况下，你可能需要给出一个组件名称数组来提供你的上下文，而不仅仅是一个字符串。
 *
 * @param contextName 注入密钥符号的描述。
 */
export function createContext<ContextValue>(
  providerComponentName: string | string[],
  contextName?: string,
) {
  const symbolDescription =
    typeof providerComponentName === 'string' && !contextName
      ? `${providerComponentName}Context`
      : contextName;

  const injectionKey: InjectionKey<ContextValue | null> = Symbol(symbolDescription);

  /**
   * @param fallback 注入失败时返回的 context 值。
   *
   * @throws 当上下文注入失败且未指定回退时。
   * 当注入上下文的组件不是提供上下文的根组件的子组件时，会发生这种情况。
   */
  const injectContext = <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T,
  ): T extends null ? ContextValue | null : ContextValue => {
    const context = inject(injectionKey, fallback);
    if (context) return context;

    if (context === null) return context as any;

    throw new Error(
      `Injection \`${injectionKey.toString()}\` not found. Component must be used within ${
        Array.isArray(providerComponentName)
          ? `one of the following components: ${providerComponentName.join(', ')}`
          : `\`${providerComponentName}\``
      }`,
    );
  };

  const provideContext = (contextValue: ContextValue) => {
    provide(injectionKey, contextValue);
    return contextValue;
  };

  return [injectContext, provideContext] as const;
}
