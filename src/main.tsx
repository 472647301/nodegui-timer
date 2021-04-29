import { App } from "./App";
import { Renderer } from "@nodegui/react-nodegui";

/**
 * 'React' refers to a UMD global, but the current file is a module
 * https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#jsx-factories
 */

Renderer.render(<App />, {
  onRender: () => {},
});
