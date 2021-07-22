import {Switch, Route, useRouteMatch} from "react-router";
import CreateEvents from "../../components/CreateEvents";
import DeleteEvents from "../../components/DeleteEvents";
import DoorList from "../../components/DoorList";
import ShowingsPage from "../../components/ShowingsPage";
import NewsletterCreate from "../newsletter/NewsletterCreate";
import AdminPanel from "./AdminPanel";
import EmailSubscriptions from "./EmailSubscriptions";

export default function AdminSwitch() {
    const { path } = useRouteMatch();
    return <Switch>
        <Route exact path={path}>
            <AdminPanel/>
        </Route>
        <Route path={`${path}/CreateEvents`}>
            <CreateEvents />
        </Route>
        <Route path={`${path}/DeleteEvents`}>
            <DeleteEvents />
        </Route>
        <Route exact path={`${path}/doorlist`}>
            <ShowingsPage />
        </Route>
        <Route path={`${path}/doorlist/:showid`}>
            <DoorList />
        </Route>
        <Route path={`${path}/email_subscriptions`}>
            <EmailSubscriptions />
        </Route>
        <Route path={`${path}/newsletter_create`}>
            <NewsletterCreate />
        </Route>
    </Switch>
}
