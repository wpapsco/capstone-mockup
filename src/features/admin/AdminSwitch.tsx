import {Switch, Route, useRouteMatch} from "react-router";
//import CreateEvents from "../../components/CreateEvents";
import NewEventMain from "./eventCreation/newEventMain";
import DeleteEvents from "../../components/DeleteEvents";
import DoorList from "../../components/DoorList";
import InstancesPage from "../../components/InstancesPage";
import NewsletterCreate from "../newsletter/NewsletterCreate";
import AdminPanel from "./AdminPanel";
import EmailSubscriptions from "./EmailSubscriptions";
import ChangePassword from "../../components/ChangePassword";
import ManageAccounts from "./ManageAccounts";

export default function AdminSwitch() {
    const { path } = useRouteMatch();
    return <Switch>
        <Route exact path={path}>
            <AdminPanel/>
        </Route>
        <Route path={`${path}/CreateEvents`}>
            <NewEventMain />
        </Route>
        <Route path={`${path}/DeleteEvents`}>
            <DeleteEvents />
        </Route>
        <Route exact path={`${path}/doorlist`}>
            <InstancesPage />
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
        <Route path={`${path}/changePassword`}>
            <ChangePassword />
        </Route>
        <Route path={`${path}/accountManagement`}>
            <ManageAccounts />
        </Route>
    </Switch>
}
