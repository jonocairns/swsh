import fs from 'fs/promises';
import path from 'path';
import { settings } from '../../db/schema';
import { PLUGINS_PATH } from '../../helpers/paths';
import { pluginManager } from '../../plugins';
import { tdb } from '../setup';

const loadMockedPlugins = async () => {
  // ensure plugins directory exists
  const mocksPath = path.join(__dirname, 'plugins');
  const plugins = await fs.readdir(mocksPath);

  // copy all mock plugins to the plugins directory used in tests
  for (const plugin of plugins) {
    const src = path.join(mocksPath, plugin);
    const dest = path.join(PLUGINS_PATH, plugin);

    await fs.cp(src, dest, { recursive: true });
  }

  await fs.writeFile(
    path.join(PLUGINS_PATH, 'plugin-states.json'),
    JSON.stringify({
      'plugin-a': true,
      'plugin-b': true,
      'plugin-with-events': true
    })
  );
};

const resetPluginMocks = async () => {
  // enable plugins in settings
  await tdb.update(settings).set({ enablePlugins: true });

  // unload all plugins before each test
  await pluginManager.unloadPlugins();

  // reset plugin states - enable test plugins
  await fs.writeFile(
    path.join(PLUGINS_PATH, 'plugin-states.json'),
    JSON.stringify({
      'plugin-a': true,
      'plugin-b': true,
      'plugin-with-events': true,
      'plugin-no-unload': true,
      'plugin-no-onload': true,
      'plugin-throws-error': true
    })
  );

  // reload plugin states into memory
  await pluginManager.loadPlugins();
  await pluginManager.unloadPlugins();
};

export { loadMockedPlugins, resetPluginMocks };
