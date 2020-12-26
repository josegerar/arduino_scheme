package TEST;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.swing.table.DefaultTableModel;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.RandomStringUtils;

/**
 *
 * @author Usuario
 */
@WebServlet(urlPatterns = {"/testServlet"})
public class testServlet extends HttpServlet {

    private boolean flag = false;
    private String message = "";
    private String applitacion = "EaCircuits App";
    private String data = "";

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println("{\"status\":" + flag + ",\"information\":\"" + message + "\",\"data\":" + data + "}");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        ConnectionBD cnn = new ConnectionBD();
        String option = request.getParameter("option");
        String query = "";
        String ruta = "";
        switch (option) {
            case "LogIn":
                String email = request.getParameter("emailLog");
                String password = request.getParameter("passwordLog");
                String password01 = DigestUtils.sha256Hex(password);
                query = "select * from users where email_user = '" + email + "' and password_email = '" + password01 + "'";
                DefaultTableModel dataModel = cnn.returnRecord(query);
                if (dataModel != null && dataModel.getRowCount() > 0) {
                    switch (dataModel.getValueAt(0, 8).toString()) {
                        case "Administrator":
                            request.getSession().setAttribute("uiUser", dataModel.getValueAt(0, 0).toString());
                            request.getSession().setAttribute("uFirstName", dataModel.getValueAt(0, 1).toString());
                            request.getSession().setAttribute("uLastName", dataModel.getValueAt(0, 2).toString());
                            request.getSession().setAttribute("uPathImg", dataModel.getValueAt(0, 5).toString());
                            request.getSession().setAttribute("uRol", dataModel.getValueAt(0, 8).toString());
                            data = cnn.getRecordsInJson(query);
                            flag = true;
                            message = "Ok";
                            break;
                        case "Developer":
                            request.getSession().setAttribute("uiUser", dataModel.getValueAt(0, 0).toString());
                            request.getSession().setAttribute("uFirstName", dataModel.getValueAt(0, 1).toString());
                            request.getSession().setAttribute("uLastName", dataModel.getValueAt(0, 2).toString());
                            request.getSession().setAttribute("uPathImg", dataModel.getValueAt(0, 5).toString());
                            request.getSession().setAttribute("uRol", dataModel.getValueAt(0, 8).toString());
                            data = cnn.getRecordsInJson(query);
                            flag = true;
                            message = "Ok";
                            break;
                    }
                } else {
                    flag = false;
                    message = "User not found";
                }
                break;

            case "getLogIn":
                if (request.getSession().getAttribute("uiUser") != null
                        && request.getSession().getAttribute("uFirstName") != null
                        && request.getSession().getAttribute("uLastName") != null
                        && request.getSession().getAttribute("uPathImg") != null
                        && request.getSession().getAttribute("uRol") != null) {
                    String firstName = (String) request.getSession().getAttribute("uFirstName");
                    String lastName = (String) request.getSession().getAttribute("uLastName");
                    String imgPath = (String) request.getSession().getAttribute("uPathImg");
                    String rol = (String) request.getSession().getAttribute("uRol");
                    data = "[{\"firstName\":\"" + firstName + "\",\"lastName\":\"" + lastName + "\",\"img\":\"" + imgPath + "\",\"rol\":\"" + rol + "\"}]";
                    flag = true;
                    message = "Aqui toy";
                } else {
                    flag = false;
                    data = "[]";
                    message = "Aqui no toy";
                }
                break;
            case "logOff":

                HttpSession sesion = request.getSession();
                sesion.invalidate();
                flag = true;
                data = "[]";
                message = "session cerrada";

                break;
            case "saveProject":
                String nameP = request.getParameter("nameProject");
                String descriptionP = request.getParameter("descriptionProjec");
                String codeProject = RandomStringUtils.randomAlphanumeric(10);
                query = "insert into projects(name_project, description_project, code_project, creationdate_project)values('" + nameP + "','" + descriptionP + "',"
                        + "'" + codeProject + "',now())";
                if (cnn.modifyBD(query)) {
                    String idUser = (String) request.getSession().getAttribute("uiUser");
                    query = "insert into permitmaster(description_permitmaster, users_id_user, projects_id_pr, root_permitmaster, joinactive_permitmaster,"
                            + "joindate_permitmaster)values('ADMIN'," + idUser + ", (select max(id_pr) from projects), true, true, now())";
                    if (cnn.modifyBD(query)) {
                        flag = true;
                        data = "[]";
                        message = "Successful project";
                    } else {
                        flag = false;
                        data = "[]";
                        message = "Error while processing project data";
                    }
                } else {
                    flag = false;
                    data = "[]";
                    message = "Error while creating the project";
                }
                break;

            case "getProjects":
                if (request.getSession().getAttribute("uiUser") != null) {
                    query = "select * from permitmaster as pm inner join projects as pr on pm.projects_id_pr = pr.id_pr\n"
                            + "where pm.users_id_user = " + (String) request.getSession().getAttribute("uiUser") + "and pm.root_permitmaster = true";
                    data = cnn.getRecordsInJson(query);
                    if (!data.equals("[]")) {
                        flag = true;
                        message = "Datos cargados";
                    } else {
                        flag = false;
                        data = "[]";
                        message = "No existen datos";
                    }
                } else {
                    flag = false;
                    data = "[]";
                    message = "User not found";
                }
                break;

            case "shareProject":
                String codeProjectShare = request.getParameter("codeProject");
                String nameProject = request.getParameter("nameProject");
                String dateCreationProject = request.getParameter("dateCreationProject");
                String idProject = request.getParameter("idProject");
                String emails = request.getParameter("emails");
                String permit = request.getParameter("permit");

                String[] arrayEmails = emails.split(",");
                String[] arrayPermit = permit.split(",");

                int emailsNotFound = 0;

                for (int i = 0; i < arrayEmails.length; i++) {
                    query = "select * from users where email_user = '" + arrayEmails[i].toString() + "'";
                    DefaultTableModel dataModel2 = cnn.returnRecord(query);
                    if (dataModel2 != null && dataModel2.getRowCount() > 0) {
                        if (!dataModel2.getValueAt(0, 0).equals((String) request.getSession().getAttribute("uiUser"))) {
                            //
                        } else {
                            flag = false;
                            data = "[]";
                            message = "No puedes usar tu propio correo";
                            emailsNotFound++;
                        }
                    } else {
                        emailsNotFound++;
                    }
                }

                if (emailsNotFound <= 0) {
                    for (int i = 0; i < arrayEmails.length; i++) {
                        query = "insert into permitmaster(description_permitmaster, users_id_user, projects_id_pr, root_permitmaster, joinactive_permitmaster,"
                                + "joindate_permitmaster) values('" + arrayPermit[i] + "', (select id_user from users where email_user = '" + arrayEmails[i] + "'), " + idProject + ""
                                + ",false,false,now())";
                        if (cnn.modifyBD(query)) {
                            flag = true;
                            data = "[]";
                            message = "Se compartio con exito tu proyectito, falta confirmar";
                        } else {

                        }
                    }
                } else {
                    flag = false;
                    data = "[]";
                    message = "Existen " + emailsNotFound + " email que no estan registrados";
                }
                break;
            case "getLoadShareProjectsForConfirm":
                if (request.getSession().getAttribute("uiUser") != null) {
                    query = "select * from permitmaster as pm inner join projects as pr on pm.projects_id_pr = pr.id_pr\n"
                            + "where pm.users_id_user = " + (String) request.getSession().getAttribute("uiUser") + " and pm.joinactive_permitmaster = false and pm.root_permitmaster = false";
                    data = cnn.getRecordsInJson(query);
                    if (!data.equals("[]")) {
                        flag = true;
                        message = "Datos cargados";
                    } else {
                        flag = false;
                        data = "[]";
                        message = "No existen datos compartidos";
                    }
                } else {
                    flag = false;
                    data = "[]";
                    message = "User not found";
                }
                break;
            case "getLoadShareProjectsConfirm":
                if (request.getSession().getAttribute("uiUser") != null) {
                    query = "select * from permitmaster as pm inner join projects as pr on pm.projects_id_pr = pr.id_pr\n"
                            + "where pm.users_id_user = " + (String) request.getSession().getAttribute("uiUser") + " and pm.joinactive_permitmaster = true and pm.root_permitmaster = false";
                    data = cnn.getRecordsInJson(query);
                    if (!data.equals("[]")) {
                        flag = true;
                        message = "Datos cargados";
                    } else {
                        flag = false;
                        data = "[]";
                        message = "No existen datos compartidos";
                    }
                } else {
                    flag = false;
                    data = "[]";
                    message = "User not found";
                }
                break;

            case "confirmShareProject":
                String codeShare = request.getParameter("codeProject");
                query = "update permitmaster set joinactive_permitmaster = true where id_pm = (select pm.id_pm from permitmaster as pm inner join projects as pr on pm.projects_id_pr = pr.id_pr\n"
                        + "where pm.users_id_user = " + (String) request.getSession().getAttribute("uiUser") + " and pm.joinactive_permitmaster = false and pm.root_permitmaster = false and\n"
                        + "pm.projects_id_pr = (select id_pr from projects where code_project = '" + codeShare + "')) \n"
                        + "and projects_id_pr = (select id_pr from projects where code_project = '" + codeShare + "')";
                System.out.println(query);
                if (cnn.modifyBD(query)) {
                    flag = true;
                    data = "[]";
                    message = "Proyecto confirmado con exito";
                } else {
                    flag = false;
                    data = "[]";
                    message = "No se pudo confirmar";
                }
                break;

            case "saveSystem":
                String nameSystem = request.getParameter("systemName");
                String descriptionSystem = request.getParameter("description");
                String pmId = request.getParameter("permitMasterId");
                String prId = request.getParameter("projectId");
                ruta = "D:\\\\Uteq Deberes\\\\6TO SEMESTRE\\\\REPOSITORIO\\\\repositorio_grupal\\\\ArudinoScheme_PI\\" + "\\_systemsIOT\\\\" + RandomStringUtils.randomAlphanumeric(10) + ".txt";
                FileAccess.writeFileText(ruta, "{}");
                ;
                query = "insert into jobs(name_job,commit_job, creationdate_job, lastmodification_job, status_job, permitmaster_id_pm,"
                        + "projects_id_pr, flagmodification_job, root_job, filepath_job)values('" + nameSystem + "', '" + descriptionSystem + "',"
                        + "now(), now(), true," + pmId + "," + prId + ",true,true,'" + ruta + "')";

                if (cnn.modifyBD(query)) {
                    flag = true;
                    data = "[]";
                    message = "Systema creado con exito :3";
                } else {
                    flag = false;
                    data = "[]";
                    message = "No se pudo crear el sistemita";
                }
                break;

            case "getSystemIot":
                String idproject = request.getParameter("projectId");
                query = "select * from jobs where projects_id_pr = " + idproject + "";
                data = cnn.getRecordsInJson(query);
                if (!data.equals("[]")) {
                    flag = true;
                    message = "Datos cargados";
                } else {
                    flag = false;
                    data = "[]";
                    message = "No existen systemas";
                }
                break;

            case "loadSystemIOT":
                //String filePath = request.getParameter("filePath");
                String nameSystemIot = request.getParameter("nameSystem");
                String idSystem = request.getParameter("idSystem");
                String pathFile = request.getParameter("filePath");

                //request.getSession().setAttribute("filePathSystem", filePath);
                request.getSession().setAttribute("nameSystem", nameSystemIot);
                request.getSession().setAttribute("idSystem", idSystem);
                request.getSession().setAttribute("filepath", pathFile);

                flag = true;
                data = "[]";
                message = "cargando sistema...";

                break;

            case "getDataSystem":

                if (request.getSession().getAttribute("uiUser") != null
                        && request.getSession().getAttribute("uFirstName") != null
                        && request.getSession().getAttribute("uLastName") != null
                        && request.getSession().getAttribute("uPathImg") != null
                        && request.getSession().getAttribute("uRol") != null) {
                    String firstName = (String) request.getSession().getAttribute("uFirstName");
                    String lastName = (String) request.getSession().getAttribute("uLastName");
                    String imgPath = (String) request.getSession().getAttribute("uPathImg");
                    String rol = (String) request.getSession().getAttribute("uRol");
                    //String filePath1 = (String) request.getSession().getAttribute("filePathSystem");
                    String nameSystem1 = (String) request.getSession().getAttribute("nameSystem");
                    String IDSystem = (String) request.getSession().getAttribute("idSystem");
                    String fileSystem = (String) request.getSession().getAttribute("filepath");
                    String nuevo = "\\";
                    String anterior = "'\'";
                    data = "[{\"firstName\":\"" + firstName + "\",\"lastName\":\"" + lastName + "\",\"img\":\"" + imgPath + "\",\"rol\":\"" + rol + "\",\"nameSystem\":\"" + nameSystem1 + "\",\"idSystem\":\"" + IDSystem + "\",\"filePath\":\"" + fileSystem.replace("\\", "\\\\") + "\"}]";
                    flag = true;
                    message = "Aqui toy";
                } else {
                    flag = false;
                    data = "[]";
                    message = "Aqui no toy";
                }

                break;

            case "getComponents":
                query = "select * from component order by id_com";
                DefaultTableModel dataResponse = cnn.returnRecord(query);
                String dataAux = "";
                if (dataResponse != null && dataResponse.getRowCount() > 0) {
                    dataAux += "[";
                    for (int row = 0; row < dataResponse.getRowCount(); row++) {
                        dataAux += "{\"id_com\":\"" + dataResponse.getValueAt(row, 0) + "\",\"name_component\":\"" + dataResponse.getValueAt(row, 1) + "\","
                                + "\"description_component\":\"" + dataResponse.getValueAt(row, 2) + "\",\"active_component\":\"" + dataResponse.getValueAt(row, 3) + "\","
                                + "\"users_id_user\":\"" + dataResponse.getValueAt(row, 4) + "\",\"pathimg_component\":\"" + dataResponse.getValueAt(row, 5) + "\","
                                + "\"dateupload_component\":\"" + dataResponse.getValueAt(row, 6) + "\",\"pathparamports\":\"" + dataResponse.getValueAt(row, 7) + "\","
                                + "\"dataParamsPorts\":" + FileAccess.readFileText(dataResponse.getValueAt(row, 7).toString()) + "},";
                    }
                    dataAux += "]";
                    data = dataAux.replace("},]", "}]");
                    message = "datos cargados";
                    flag = true;
                } else {
                    flag = false;
                    message = "datos no cargados";
                }

                /*data = cnn.getRecordsInJson(query);
                if (!data.equals("[]")) {
                    flag = true;
                    message = "datos cargados";
                } else {
                    flag = false;
                    message = "datos no cargados";
                }*/
                break;

            case "createAccount":
                String firstName = request.getParameter("firstName");
                String lastName = request.getParameter("lastName");
                String emailNew = request.getParameter("email");
                String passwordNew = request.getParameter("password");
                String phone = request.getParameter("phone");

                query = String.format("insert into users(name_user, lastname_user, email_user, password_email, img_user, codeverification_user, dateverification_user"
                        + ", typeuser_user, phone_user)values('%s','%s','%s','%s','resources\\\\img\\\\createAccount.png',null,null,'Desarrollador','%s')",
                        firstName, lastName, emailNew, DigestUtils.sha256Hex(passwordNew), phone);

                if (cnn.modifyBD(query)) {
                    flag = true;
                    data = "[]";
                    message = "Successfully implemented action";
                } else {
                    flag = false;
                    data = "[]";
                    message = "Action discontinued";
                }
                break;

            case "getComponentesActive":
                if (request.getSession().getAttribute("uiUser") != null
                        && request.getSession().getAttribute("uFirstName") != null
                        && request.getSession().getAttribute("uLastName") != null
                        && request.getSession().getAttribute("uPathImg") != null
                        && request.getSession().getAttribute("uRol") != null) {
                    query = "select * from component where users_id_user = " + request.getSession().getAttribute("uiUser") + " and active_component = 'A' order by id_com";
                    DefaultTableModel dataResponseA = cnn.returnRecord(query);
                    String dataAuxA = "";
                    if (dataResponseA != null && dataResponseA.getRowCount() > 0) {
                        dataAuxA += "[";
                        for (int row = 0; row < dataResponseA.getRowCount(); row++) {
                            dataAuxA += "{\"id_com\":\"" + dataResponseA.getValueAt(row, 0) + "\",\"name_component\":\"" + dataResponseA.getValueAt(row, 1) + "\","
                                    + "\"description_component\":\"" + dataResponseA.getValueAt(row, 2) + "\",\"active_component\":\"" + dataResponseA.getValueAt(row, 3) + "\","
                                    + "\"users_id_user\":\"" + dataResponseA.getValueAt(row, 4) + "\",\"pathimg_component\":\"" + dataResponseA.getValueAt(row, 5) + "\","
                                    + "\"dateupload_component\":\"" + dataResponseA.getValueAt(row, 6) + "\",\"pathparamports\":\"" + dataResponseA.getValueAt(row, 7) + "\","
                                    + "\"dataParamsPorts\":" + FileAccess.readFileText(dataResponseA.getValueAt(row, 7).toString()) + "},";
                        }
                        dataAuxA += "]";
                        data = dataAuxA.replace("},]", "}]");
                        message = "datos cargados";
                        flag = true;
                    } else {
                        data = "[]";
                        flag = false;
                        message = "datos no cargados";
                    }
                }
                break;

            case "getComponentsTotal":
                if (request.getSession().getAttribute("uiUser") != null
                        && request.getSession().getAttribute("uFirstName") != null
                        && request.getSession().getAttribute("uLastName") != null
                        && request.getSession().getAttribute("uPathImg") != null
                        && request.getSession().getAttribute("uRol") != null) {

                    query = "select * from component";
                    data = cnn.getRecordsInJson(query);
                    if (!data.equals("[]")) {
                        flag = true;
                        message = "datos cargados totales";
                    } else {
                        flag = false;
                        message = "datos no cargados";
                    }
                }
                break;

            case "saveComponent":
                if (request.getSession().getAttribute("uiUser") != null
                        && request.getSession().getAttribute("uFirstName") != null
                        && request.getSession().getAttribute("uLastName") != null
                        && request.getSession().getAttribute("uPathImg") != null
                        && request.getSession().getAttribute("uRol") != null) {

                    String nameComponent = request.getParameter("nameComponent");
                    String descriptionComponennt = request.getParameter("descriptionComponent");
                    String status = request.getParameter("activeComponent");
                    String patImg = request.getParameter("pathImgComponent");
                    String dataParamPorts = request.getParameter("dataPorts");
                    ruta = "D:\\\\Uteq Deberes\\\\6TO SEMESTRE\\\\REPOSITORIO\\\\repositorio_grupal\\\\ArudinoScheme_PI\\" + "\\_paramPorts\\\\" + RandomStringUtils.randomAlphanumeric(10) + ".txt";
                    FileAccess.writeFileText(ruta, dataParamPorts);

                    patImg.replace("//", "\\\\");
                    query = String.format("insert into component(name_component, description_component, active_component, users_id_user, pathimg_component,"
                            + "dateupload_component, pathparamports)values('%s', '%s', '%s', %s, '%s', now(),'%s')", nameComponent, descriptionComponennt, status,
                            request.getSession().getAttribute("uiUser"), patImg.replace("\\", "\\\\"), ruta);
                    System.out.println(query);

                    if (cnn.modifyBD(query)) {
                        data = "[]";
                        flag = true;
                        message = "Successfully implemented action";
                    } else {
                        data = "[]";
                        flag = false;
                        message = "Action discontinued";
                    }

                } else {

                }
                break;

            case "getComponentsInactive":
                if (request.getSession().getAttribute("uiUser") != null
                        && request.getSession().getAttribute("uFirstName") != null
                        && request.getSession().getAttribute("uLastName") != null
                        && request.getSession().getAttribute("uPathImg") != null
                        && request.getSession().getAttribute("uRol") != null) {
                    query = "select * from component where users_id_user = " + request.getSession().getAttribute("uiUser") + " and active_component = 'I' order by id_com";
                    DefaultTableModel dataResponseA = cnn.returnRecord(query);
                    String dataAuxA = "";
                    if (dataResponseA != null && dataResponseA.getRowCount() > 0) {
                        dataAuxA += "[";
                        for (int row = 0; row < dataResponseA.getRowCount(); row++) {
                            dataAuxA += "{\"id_com\":\"" + dataResponseA.getValueAt(row, 0) + "\",\"name_component\":\"" + dataResponseA.getValueAt(row, 1) + "\","
                                    + "\"description_component\":\"" + dataResponseA.getValueAt(row, 2) + "\",\"active_component\":\"" + dataResponseA.getValueAt(row, 3) + "\","
                                    + "\"users_id_user\":\"" + dataResponseA.getValueAt(row, 4) + "\",\"pathimg_component\":\"" + dataResponseA.getValueAt(row, 5) + "\","
                                    + "\"dateupload_component\":\"" + dataResponseA.getValueAt(row, 6) + "\",\"pathparamports\":\"" + dataResponseA.getValueAt(row, 7) + "\","
                                    + "\"dataParamsPorts\":" + FileAccess.readFileText(dataResponseA.getValueAt(row, 7).toString()) + "},";
                        }
                        dataAuxA += "]";
                        data = dataAuxA.replace("},]", "}]");
                        message = "datos cargados";
                        flag = true;
                    } else {
                        data = "[]";
                        flag = false;
                        message = "datos no cargados";
                    }
                }
                break;

            case "getComponentsPropuesta":
                if (request.getSession().getAttribute("uiUser") != null
                        && request.getSession().getAttribute("uFirstName") != null
                        && request.getSession().getAttribute("uLastName") != null
                        && request.getSession().getAttribute("uPathImg") != null
                        && request.getSession().getAttribute("uRol") != null) {
                    query = "select * from component as c inner join users as u on c.users_id_user = u.id_user where c.active_component = 'I' order by c.id_com";
                    DefaultTableModel dataResponseA = cnn.returnRecord(query);
                    String dataAuxA = "";
                    if (dataResponseA != null && dataResponseA.getRowCount() > 0) {
                        dataAuxA += "[";
                        for (int row = 0; row < dataResponseA.getRowCount(); row++) {
                            dataAuxA += "{\"id_com\":\"" + dataResponseA.getValueAt(row, 0) + "\",\"name_component\":\"" + dataResponseA.getValueAt(row, 1) + "\","
                                    + "\"description_component\":\"" + dataResponseA.getValueAt(row, 2) + "\",\"active_component\":\"" + dataResponseA.getValueAt(row, 3) + "\","
                                    + "\"users_id_user\":\"" + dataResponseA.getValueAt(row, 4) + "\",\"pathimg_component\":\"" + dataResponseA.getValueAt(row, 5) + "\","
                                    + "\"dateupload_component\":\"" + dataResponseA.getValueAt(row, 6) + "\",\"pathparamports\":\"" + dataResponseA.getValueAt(row, 7) + "\","
                                    + "\"dataParamsPorts\":" + FileAccess.readFileText(dataResponseA.getValueAt(row, 7).toString()) + ",\"id_user\":\"" + dataResponseA.getValueAt(row, 8) + "\","
                                    + "\"nameUser\":\"" + dataResponseA.getValueAt(row, 9) + " " + dataResponseA.getValueAt(row, 10) + "\"},";
                        }
                        dataAuxA += "]";
                        data = dataAuxA.replace("},]", "}]");
                        message = "datos cargados";
                        flag = true;
                    } else {
                        data = "[]";
                        flag = false;
                        message = "datos no cargados";
                    }
                }
                break;

            case "aproveComponent":
                String idComponent = request.getParameter("idComponent");
                query = "update component set active_component = 'A' where id_com = " + idComponent + "";

                if (cnn.modifyBD(query)) {
                    data = "[]";
                    flag = true;
                    message = "Successfully implemented action";
                } else {
                    data = "[]";
                    flag = false;
                    message = "Action discontinued";
                }
                break;

            case "saveSystemTotal":
                String dataModelTotal = request.getParameter("dataModel");
                String IDSystem = (String) request.getSession().getAttribute("idSystem");
                String fileSystem = (String) request.getSession().getAttribute("filepath");
                
                query = String.format("update jobs set lastmodification_job = now() where id_job = %s",IDSystem);
                FileAccess.writeFileText(fileSystem, dataModelTotal);
                
                if (cnn.modifyBD(query)) {
                    data = "[]";
                    flag = true;
                    message = "Successfully implemented action";
                } else {
                    data = "[]";
                    flag = false;
                    message = "Action discontinued";
                }

                break;
                
            case "loadSystemTotal":
                String fileSystemA = (String) request.getSession().getAttribute("filepath");
                String dataLoad = FileAccess.readFileText(fileSystemA);
                
                if(dataLoad != "{}"){
                    data = dataLoad;
                    flag = true;
                    message = "Successfully implemented action";
                } else {
                    data = "{}";
                    flag = false;
                    message = "Action discontinued";
                }
                
                break;
        }
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
