export default function launchIgnition(Ignition: any, report: Flare.ErrorReport): void {
    const config = {
        directorySeparator: '/',
        editor: 'vscode',
        enableRunnableSolutions: true,
        enableShareButton: true,
        localSitesPath: '',
        remoteSitesPath: '',
        theme: 'light',
    };

    new Ignition({
        report,
        config,
        solutions: report.solutions,
        telescopeUrl: null,
        shareEndpoint: 'http://titanic.app.test/_ignition/share-report',
        defaultTab: 'StackTab',
        defaultTabProps: [],
    }).start();
}
