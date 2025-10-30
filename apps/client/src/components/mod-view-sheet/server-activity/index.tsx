import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Link, MessageCircle } from 'lucide-react';
import { memo } from 'react';

const ServerActivity = memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Server Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Messages */}
        <div className="flex items-center justify-between py-1.5 px-1 hover:bg-muted/30 rounded cursor-pointer">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Messages</span>
          </div>
          <span className="text-sm text-muted-foreground">1,234</span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between py-1.5 px-1 hover:bg-muted/30 rounded cursor-pointer">
          <div className="flex items-center gap-3">
            <Link className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Links</span>
          </div>
          <span className="text-sm text-muted-foreground">23</span>
        </div>

        {/* Media */}
        <div className="flex items-center justify-between py-1.5 px-1 hover:bg-muted/30 rounded cursor-pointer">
          <div className="flex items-center gap-3">
            <Image className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Media</span>
          </div>
          <span className="text-sm text-muted-foreground">67</span>
        </div>
      </CardContent>
    </Card>
  );
});

export { ServerActivity };
