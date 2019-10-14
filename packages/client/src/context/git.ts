import build from '../build';

export default function git() {
    return build.gitInfo ? { git: build.gitInfo } : {};
}
