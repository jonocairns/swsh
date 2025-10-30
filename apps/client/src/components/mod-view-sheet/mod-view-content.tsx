import { Header } from './header';
import { ServerActivity } from './server-activity';
import { UserInformation } from './user-information';

const ModViewContent = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-4 p-4">
        <Header />
        <div className="border-t border-border" />
        <ServerActivity />
        <UserInformation />
      </div>
    </div>
  );
};

export { ModViewContent };
