namespace f14.Navigation {

    export class NavigationStack {
        private pathStack: string[] = [];

        public Add(pathPart: string): void {
            this.pathStack.push(pathPart);
        }

        public Pop(): string {
            return this.pathStack.pop();
        }

        public Clear(): void {
            this.pathStack.length = 0;
        }

        public GetCurrentPath(): string {
            let path: string = '';
            for (var i of this.pathStack) {
                path += i + '/';
            }
            return path.slice(0, path.length - 1);
        }

        public IsRootPath(path?: string): boolean {
            if (path === undefined) {
                path = this.GetCurrentPath();
            }
            if (this.pathStack.length > 0) {
                return this.pathStack[0] === path;
            }
            throw "Navigation path stack is empty. Critical error.";
        }
    }    
}