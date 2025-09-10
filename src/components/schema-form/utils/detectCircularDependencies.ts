import type { Schema } from '../types';

/**
 * 构建依赖关系图
 * @param schema 表单配置数组
 * @returns 依赖关系图 { 字段名: 依赖字段数组 }
 */
const buildDependencyGraph = (schema: Schema[]): Record<string, string[]> => {
  const graph: Record<string, string[]> = {};

  // 递归处理嵌套的schema
  const processSchema = (items: Schema[], parentField = '') => {
    items.forEach((item) => {
      const field = parentField ? `${parentField}.${item.field}` : item.field;

      // 初始化字段的依赖数组
      graph[field] = graph[field] || [];

      // 添加当前字段的依赖
      if (item.optionsDependencies && item.optionsDependencies.length) {
        graph[field].push(...item.optionsDependencies);
      }

      // 处理对象类型的嵌套字段
      if (item.type === 'object' && 'properties' in item) {
        processSchema(item.properties, field);
      }

      // 处理数组类型的嵌套字段
      if (item.type === 'array' && 'items' in item) {
        // 数组项为对象类型时需要递归处理
        if (item.items.type === 'object' && 'properties' in item.items) {
          processSchema(item.items.properties, `${field}[*]`);
        }
      }
    });
  };

  processSchema(schema);
  return graph;
};

/**
 * 检测依赖关系图中的循环依赖
 * @param graph 依赖关系图
 * @returns 循环依赖路径数组，如果没有循环则返回空数组
 */
const findCycles = (graph: Record<string, string[]>): string[][] => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];

  /**
   * 深度优先搜索检测环
   * @param node 当前节点
   * @param path 当前路径
   */
  const dfs = (node: string, path: string[]) => {
    // 如果节点已在当前递归栈中，说明找到一个环
    if (recursionStack.has(node)) {
      const cycleStartIndex = path.indexOf(node);
      if (cycleStartIndex !== -1) {
        // 提取循环部分
        const cycle = path.slice(cycleStartIndex);
        cycles.push([...cycle, node]); // 闭合循环路径
      }
      return;
    }

    // 如果节点已访问过，直接返回
    if (visited.has(node)) {
      return;
    }

    // 标记节点为已访问和加入当前递归栈
    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    // 递归访问依赖的节点
    if (graph[node]) {
      graph[node].forEach((dependentNode) => {
        dfs(dependentNode, [...path]);
      });
    }

    // 从递归栈中移除节点
    recursionStack.delete(node);
  };

  // 对每个节点执行DFS
  Object.keys(graph).forEach((node) => {
    if (!visited.has(node)) {
      dfs(node, []);
    }
  });

  return cycles;
};

/**
 * 检测表单配置中的循环依赖
 * @param schema 表单配置数组
 * @returns 包含所有循环依赖信息的对象
 */
export const detectCircularDependencies = (schema: Schema[]) => {
  const graph = buildDependencyGraph(schema);
  const cycles = findCycles(graph);

  // 去重相同的循环（不同起点但相同的循环）
  const uniqueCycles = Array.from(
    new Map(
      cycles.map((cycle) => {
        // 找到循环的最小表示（按字母顺序找到起点）
        const minIndex = cycle.reduce((min, node, index) => (node < cycle[min] ? index : min), 0);
        // 旋转数组使最小元素在前面，作为唯一键
        const normalized = [...cycle.slice(minIndex), ...cycle.slice(0, minIndex)];
        return [normalized.join('->'), cycle];
      }),
    ).values(),
  );

  return {
    hasCircularDependencies: uniqueCycles.length > 0,
    cycles: uniqueCycles,
  };
};

/**
 * 验证表单配置并在发现循环依赖时抛出错误
 * @param schema 表单配置数组
 */
export const validateDependencies = (schema: Schema[]) => {
  const result = detectCircularDependencies(schema);

  if (result.hasCircularDependencies) {
    const errorMessages = result.cycles
      .map((cycle, index) => {
        return `循环 ${index + 1}: ${cycle.join(' -> ')}`;
      })
      .join('\n');

    console.error(`检测到循环依赖:\n${errorMessages}`);

    // 在开发环境下抛出错误，生产环境下仅打印警告
    if (import.meta.env.DEV) {
      throw new Error(`表单配置中存在循环依赖，请检查:\n${errorMessages}`);
    }
  }

  return result;
};
